# Player-tech-assignment
This repository is a job technical assignment. The assignment description can be found in `docs/assignment.md`. The following README will contain the documentations

## Requirements

  * NodeJs >= 12.13.1
  * npm >= 6.12.1

## Installation process

    git clone <repo>
    cd <repo>
    npm install

## How to use
Since the API is mocked, the clientId and clientSecret are hard coded values `clientId = '12345abc'`, `clientSecret = superSecret123`. To set configuration use built-in tool as follow:

    node devTools.js config set clientId 12345abc
    node devTools.js config set clientSecret superSecret123

You can also inpect your configuration as follow:

    node devTools.js config get

The above will return the complete configuation file. To get a given property, simply state the property after `get` keyword

    node devTools.js config get clientId

If you want to use another configuration file than the default one simply define `DEV_TOOL_CONFIG` environment variable with the path of your custom **YAML** file.

    export DEV_TOOL_CONFIG=/path/to/custom/config.yml

## Player modules
Player module only contain the update function. This function will do a `PUT` call the player update API to inject information contained in the CSV file given as input.

    node devTools.js player update /path/to/csv/input/file.csv

### CSV format
The csv file use as input  is expected to respect a certain format describe here. The first column always contain the MAC address of the player that need update. The subsequent columns are:

  * The ApplicationId as header
  * The version number as value

| mac_addresses     | music_app | diagnostic_app | settings_app |
| ----------------- | --------- | -------------- | ------------ |
| a1:bb:cc:dd:ee:ff | v1.4.10   | v1.2.6         | v1.1.5       |
| a1:bb:cc:dd:ee:ff | v1.4.10   | v1.2.6         | v1.1.5       |

You can also look into the test folder, there is a file called `input.csv` used in the unit test. You can use that `input.csv` as an example.

## Developers
In order to have development dependency, you will need to use the following command to install it:

    npm install

### Unit test
Unit test can be run with the following command:

    npm run test

