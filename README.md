# Receipt Pro

## Setup

1. Install system dependencies
  - PostgreSQL (required 9.3 or above)
  - Node.js / NPM
2. Install npm and bower by running `npm install`
3. Install grunt-cli globally for convenience with `npm install --global grunt-cli`
4. To install e2e test dependencies run `npm run update-webdriver`
5. Run `createdb epson_receipts_development` and `createdb epson_receipts_test` to create databases
6. Run `NODE_ENV=test grunt migrate` to migrate the test database and
   `grunt migrate` to migrate the development database.
7. Setup AWS as described below

### AWS Credentials and Setup for Local Development

Even during local development the app depends on S3 and SQS in order to store images and run the OCR. By default these resources will be named based on your local username in order to help prevent conflicts during development.

In order to access AWS, you'll need to add a local.js file to the config directory of your project. This file is (and should remain) excluded from git. The file can be found in Slack at:
 - [local.js][1]

Once you have configured access to AWS you will need to create the S3 bucket and SQS queue for your username. This can be done by running the command `grunt provision`.

### Driver Installation for Local Development

In order to import receipts or scan from a device, you'll need to install the Dynamic Web TWAIN Driver (currently using the trial version) and the Epson device drivers (for the DS-30 and DS-510 models). The files can be found in Slack at:
 - [Dynamic Web TWAIN Driver for Mac][2]
 - [Epson DS-30 Device Driver for Mac][3]
 - [Epson DS-510 Device Driver for Mac][4]

There may be some troubleshooting involved in getting the scanner working locally. Here are some steps to work through if you have installed the Epson driver and are not seeing the device in the Scan drop-down of the Epson Receipts app on your local dev machine.

1. Fire up the app called **EPSON Scan Settings** and see if the scanner is detected in the list under *Select Scanner*. If it's in the list, make sure it is selected and click **Test**. It should return with a pop-up after the test saying *Scanner is Ready*. Now check your local EPSON deployment to see if the scanner is listed in the **Scan** dropdown menu.
2. In Chrome, go to **Tools** > **Task Manager** and look for a task called *Plug-in: Dynamic Web TWAIN x.xx*. Select the task and click **End Process**. Now refresh your Receipt Pro app and see if the scanner is listed in the **Scan** dropdown menu.
3. If neither of the above solutions work, try restarting your machine.

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
  [3]: https://files.slack.com/files-pri/T024Z5CQB-F029ZFH8Y/download/epson15864.dmg
  [4]: https://files.slack.com/files-pri/T024Z5CQB-F027899A2/download/epson15994.dmg

### Installing on Windows
You may need to manually create the directory `C:\Users\<your user>\AppData\Roaming\npm`
If prompted during `npm install`, choose the most recent Angular version.
Install Python