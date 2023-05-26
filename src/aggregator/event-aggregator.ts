import * as readline from 'node:readline';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WebSocket } from 'ws';
import { Event } from 'src/domain/Event';
import { ReceivedEventDto } from 'src/interface/dto/ReceivedEvent.dto';
import { EventUseCase } from 'src/use-cases/event-use-case';
import { MsgType } from 'src/domain/constant';
import { v4 as uuidv4 } from 'uuid';
import { MessageBody } from '@nestjs/websockets';
import { EventPresenter } from 'src/interface/presenter/event-presenter';

@Injectable()
export class EventAggregator implements OnApplicationBootstrap {
  relays: WebSocket[] = [];
  addresses: string[] = [];
  private subscriptionId!: string;
  constructor(
    private readonly eventUseCase: EventUseCase,
    private readonly eventPresenter: EventPresenter,
  ) {}

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

        relay.on('message', async (data) => {
          const message = JSON.parse(data.toString());
          if (message[0] === MsgType.EVENT) {
            // If the relay server sends an EVENT message, then a new event has been published
            await this.receiveEvent(message);
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
        const eventEntity: Event = await this.eventPresenter.dtoToEntity(
          eventDto,
        );
        // save event to db
        await this.eventUseCase.receiveEvent(eventEntity);
        console.log('received event: ', JSON.stringify(eventEntity));
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          resolve();
        }
      }
    });
  }

  private async prompt(message: string): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(message, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
}
