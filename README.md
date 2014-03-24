# EPSON Receipts

## Setup

1. Install npm and bower dependencies with `npm install`
2. For local development run `npm run link` to link the sub modules into the project.
3. Install grunt-cli globally for convenience with `npm install --global grunt-cli`
4. selenium-webdriver is broken, until it is fixed run `npm run patch` to apply a patch.
5. To install e2e test dependencies run `npm run update-webdriver`
6. Install postgresql
7. Run `createdb epson_receipts_development` to create the database
8. Run `./server/node_modules/.bin/knex migrate:latest --config ./server/config/database.js` to migrate

## Development Usage

(See submodules

### Build

Run `grunt build`.

### Tests

Run `grunt test` to run all tests

### Watch / Development

Running `grunt development` will start:
- Development Server on http://localhost:8000/
- Watch task to rebuild scripts
- Watch task to rebuild stylesheets
- Watch task to build and run unit tests (e2e tests must be run manually)
