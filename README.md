## Description

Monorepo includes Nostr event-aggregator & event-consumer

### Event Aggregator

Event-Aggregator can link to multiple relays and subscribe events from those relays. Whenever there're new events occur in each relay, Event-Aggregator will receive the events and send them into KAFKA for the Event-Consumer to save them into database later

### Event Consumer

Event-Consumer only do one things that is consuming events in the KAFKA, and storing them into PostgresDb

## Requirements

### Phase III

- Connect to a relay and fetch all events from it. You may use this <to be provided> relay which is set to generate at least 1 random event every 15 seconds
- All events fetched must be stored in a database (which can be the same Database or a different one from Phase 2)
- Your Event Aggregator should display the events stored in the database
  - You may display the events in any order you wish
- Please provide a short writeup of why you chose a particular database for Phase 3, answering the following questions:
  - Why did you choose this database? Is it the same or different database as the one you used in Phase 2? Why is it the same or a different one?
    1. Yes, I chose the same database I used in Phase2, cuz I want to implement this project more efficiently. I can use the same schemas defined previously.
  - If the number of events to be stored will be huge, what would you do to scale the database?
    1. I will do database sharding if the stored events became tremendous.

### PhaseIV

- Connect to at least 3 relays and fetch all events from it. You may use this https://relay.nekolicio.us which is set to generate at least **1 random event every 5 seconds**
- Event updates received from the relays must be pushed to a Queue or Message Broker
- All events must be fetched from the Queue or Message Broker before they are stored in a database
- Your Event Aggregator should display the events fetched from the database
- Please provide a short writeup of why you chose a particular Queue or Event Stream system for Phase 4, answering the following questions:
  - Why did you choose this solution?
    1. Our company uses KAFKA as our event stream system, so I choose this solution to get more familiar with it.
    2. KAFKA has higher throughput comparing to RabbitMQ. Therefore, considering that the aggregator may subscribe many relays at the same time and relays may receive large amount of messages from tremendous clients, KAFKA with higher throughput could be the better choice.
  - If the number of events to be stored will be huge, what would you do to scale your chosen solution?
    1. Since Event-Aggregator is more likely a gateway which the only thing it does is that receive and send messages from relay to the message queue, I consider when the number of events become huge, the bottleneck will be Event-Consumer. Hence, we need to horizontally scale the Event-Consumer in order to handle tremendous events in the queue more efficiently than before.
    2. Furthermore, We can let the different consumers to be responsible for the events from different relays if the number of events are evenly distributed from different relays. For example, we could assign messages from the corresponding relay to the specific partitions, and then consumed by the particular consumer. The practical strategy of consuming the messages may be more complicated that depends on the scenarios we encounter.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start event-aggregator
$ npm run start event-consumer

# watch mode
$ npm run start:dev event-aggregator
$ npm run start:dev event-consumer

# production mode
$ npm run start:prod event-aggregator
$ npm run start:prod event-consumer
```
