# EPSON Receipts

## Setup

1. Install system dependencies
  - PostgreSQL
  - Node.js / NPM
2. Install npm and bower by running `npm install`
3. Install grunt-cli globally for convenience with `npm install --global grunt-cli`
4. selenium-webdriver is broken, until it is fixed run `npm run patch` to apply a patch.
5. To install e2e test dependencies run `npm run update-webdriver`
6. Run `createdb epson_receipts_development` and `createdb epson_receipts_test` to create databases
8. Run `grunt migrate` to migrate

### Watch / Development

Running `grunt development` will start:
- Development Server on http://localhost:8000/
- Watch task to rebuild scripts
- Watch task to rebuild stylesheets
- Watch task to build and run unit tests (e2e tests must be run manually)

### Build

Run `grunt build`.
(This will be done automatically when running `grunt development`)

### Tests

Run `grunt test` to run all tests


