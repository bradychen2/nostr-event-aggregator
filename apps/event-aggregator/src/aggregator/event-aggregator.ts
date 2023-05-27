import * as readline from 'node:readline';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { MessageBody } from '@nestjs/websockets';
import { EventUseCase } from '@app/event-lib/use-cases';
import { Event, MsgType } from '@app/event-lib/domain';
import { ReceivedEventDto } from '@app/event-lib/interface';

@Injectable()
export class EventAggregator implements OnApplicationBootstrap {
  relays: WebSocket[] = [];
  addresses: string[] = [];
  private subscriptionId!: string;
  private rlInterface: readline.Interface;

  constructor(
    @Inject('EVENT_AGGREGATOR_SERVICE')
    private readonly eventClient: ClientKafka,
    private readonly eventUseCase: EventUseCase,
  ) {
    this.rlInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public async onAggregatorInit() {
    let relay: WebSocket | Error | undefined = undefined;
    while (true) {
      // Prompt the user to input the URL of the relay server
      const userInput = await this.promptUserLinkToNewRelay();
      if (userInput === 'q' || userInput === 'Q') {
        // If the user enters "q" or "Q",
        // disconnects all relays and return
        this.relays.forEach((relay) => {
          relay.close();
        });
        return;
      }
      // Connect to the relay server
      relay = await this.linkToRelay(userInput);
      if (relay instanceof WebSocket) {
        // Send the REQ message to subscribe events from the relay server
        const subscriptionId = this.subscriptionId
          ? this.subscriptionId
          : uuidv4();
        const reqMessage = [MsgType.REQ, subscriptionId];
        relay.send(JSON.stringify(reqMessage));
      }
    }
  }

  async onApplicationBootstrap() {
    // Fetch and display the latest 20 stored events from the aggregator db
    await this.fetchLatestEvents();
  }

  private async fetchLatestEvents() {
    const latestStoredEvents: Event[] = await this.eventUseCase.getLatestEvents(
      20,
    );
    console.log('Latest stored events:');
    (latestStoredEvents || []).forEach((event) => {
      console.log(JSON.stringify(event));
    });
  }

  private async promptUserLinkToNewRelay() {
    // Prompt the user to input the URL of the relay server
    const relayServerUrl: string = await this.prompt(
      'Enter the URL of the relay server you would like to link ("q" or "Q" to quit): ',
    );
    return relayServerUrl;
  }

  private async linkToRelay(
    relayServerUrl: string,
  ): Promise<WebSocket | Error> {
    return new Promise((resolve) => {
      try {
        if (this.addresses.includes(relayServerUrl)) {
          console.log('Already connected to this relay');
          return resolve(new Error('Already connected to this relay'));
        }

        const relay: WebSocket = new WebSocket(relayServerUrl);

        relay.on('open', () => {
          this.relays.push(relay);
          this.addresses.push(relayServerUrl);
          console.log(`Connected to relay: ${relayServerUrl}`);
          return resolve(relay);
        });

        relay.on('close', () => {
          this.addresses.filter((address) => address !== relayServerUrl);
          console.log(`Disconnected from relay: ${relayServerUrl}`);
        });

        relay.on('error', (error) => {
          console.log('Error connecting to relay:', error);
          return resolve(new Error('Error connecting to relay'));
        });

        relay.on('message', async (message) => {
          const messageArray = JSON.parse(message.toString());
          // if message is not an array, ignore it
          if (!Array.isArray(messageArray)) {
            console.log('Received invalid message from relay');
            return;
          }
          const messageType = messageArray[0];
          switch (messageType) {
            case MsgType.EVENT:
              // send event to Kafka
              await this.receiveEvent(message);
              break;
            default:
              console.log('Received invalid message from relay');
              break;
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error connecting to relay:', error.message);
        }
        return resolve(new Error('Error connecting to relay'));
      }
    });
  }

  async receiveEvent(@MessageBody() eventDto: ReceivedEventDto): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        // send Dto to Kafka
        await this.eventClient.emit('received_event', eventDto);
        console.log('Send received event to Kafka');
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Failed to handle received message ${error.message}`);
          resolve();
        }
      }
    });
  }

  private async prompt(message: string): Promise<string> {
    return new Promise<string>((resolve) => {
      this.rlInterface.question(message, (answer) => {
        resolve(answer);
      });
    });
  }
}
