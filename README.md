## Description

Phaselll assignment of DISRISE project

## Requirements

- Connect to a relay and fetch all events from it. You may use this <to be provided> relay which is set to generate at least 1 random event every 15 seconds
- All events fetched must be stored in a database (which can be the same Database or a different one from Phase 2)
- Your Event Aggregator should display the events stored in the database
  - You may display the events in any order you wish
- Please provide a short writeup of why you chose a particular database for Phase 3, answering the following questions:
  - Why did you choose this database? Is it the same or different database as the one you used in Phase 2? Why is it the same or a different one?
  - If the number of events to be stored will be huge, what would you do to scale the database?

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
