# EPSON Receipts

## Setup

1. Install npm and bower dependencies with `npm install`
2. Install grunt-cli globally for convenience with `npm install --global grunt-cli`
3. selenium-webdriver is broken, until it is fixed run `npm run patch` to apply a patch.

## Development Usage

### Build

Run `grunt build` or just `grunt`. Output will be placed in the `build` directory.

### Tests

- Run `grunt test` to run all tests
- Run `grunt test:unit` for unit tests
- Run `grunt test:e2e` for integration tests

### Watch / Development

Running `grunt development` will start:
- Development Server on http://localhost:8000/
- Watch task to rebuild scripts
- Watch task to rebuild stylesheets
- Watch task to build and run unit tests (e2e tests must be run manually)
