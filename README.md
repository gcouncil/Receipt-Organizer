# EPSON Receipts

## Setup

1. Install system dependencies
  - PostgreSQL
  - Node.js / NPM
2. Install npm and bower by running `npm install`
3. Install grunt-cli globally for convenience with `npm install --global grunt-cli`
4. To install e2e test dependencies run `npm run update-webdriver`
5. Run `createdb epson_receipts_development` and `createdb epson_receipts_test` to create databases
6. Run `NODE_ENV=test grunt migrate` to migrate the test database and
   `grunt migrate` to migrate the development database.

### S3 Credentials for Local Development
In order to save receipt images to S3, you'll need to add a local.js file to the config directory of your project. This file is (and should remain) excluded from git. The file can be found in Slack at:
 - [local.js][1]

### Driver Installation for Local Development
In order to import receipts or scan from a device, you'll need to install the Dynamic Web TWAIN Driver (currently using the trial version) and the Epson device drivers (for the DS-30 and DS-510 models). The files can be found in Slack at:
 - [Dynamic Web TWAIN Driver for Mac][2]
 - [Epson Device Driver for Mac][3]

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
Or `grunt test --coverage` to generate coverage reports in the `coverage` folder.

### Create Migrations

Run `grunt migrate:make:NAME_OF_MIGRATION`.
You will find your migration in the `migrations` folder in the main
directory


  [1]: https://files.slack.com/files-pri/T024Z5CQB-F029H7KFW/download/local.js
  [2]: https://files.slack.com/files-pri/T024Z5CQB-F0277QMBM/download/dynamicwebtwainmacedition.pkg
  [3]: https://files.slack.com/files-pri/T024Z5CQB-F0277U7GH/download/epson16008.dmg