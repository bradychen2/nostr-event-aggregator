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
  private subscriptionId!: string;
  constructor(
    private readonly eventUseCase: EventUseCase,
    private readonly eventPresenter: EventPresenter,
  ) {}

  public async onGatewayInit() {
    let relay: WebSocket | Error | undefined = undefined;
    while (!(relay instanceof WebSocket)) {
      // Prompt the user to input the URL of the relay server
      const relayServerUrl = await this.promptUserLinkToNewRelay();
      // Connect to the relay server
      relay = await this.linkToRelay(relayServerUrl);
    }
    // Send the REQ message to subscribe to events from the relay server
    this.subscriptionId = uuidv4();
    const reqMessage = [MsgType.REQ, this.subscriptionId];
    relay.send(JSON.stringify(reqMessage));
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
      'Enter the URL of the relay server you would like to link: ',
    );
    return relayServerUrl;
  }

  private async linkToRelay(
    relayServerUrl: string,
  ): Promise<WebSocket | Error> {
    return new Promise((resolve) => {
      try {
        const relay: WebSocket = new WebSocket(relayServerUrl);
        relay.on('open', () => {
          console.log(`Connected to relay: ${relayServerUrl}`);
          this.relays.push(relay);
          return resolve(relay);
        });

        relay.on('close', () => {
          console.log(`Disconnected from relay: ${relayServerUrl}`);
          this.onGatewayInit();
        });

        relay.on('error', (error) => {
          console.log('Error connecting to relay:', error);
          return resolve(new Error('Error connecting to relay'));
        });

        relay.on('message', (data) => {
          const message = JSON.parse(data.toString());
          if (message[0] === MsgType.EVENT) {
            // If the relay server sends an EVENT message, then a new event has been published
            this.receiveEvent(message);
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
