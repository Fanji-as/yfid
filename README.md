# YFID Express.js

[![Build Status][build-status-image]][build-status-url]
[![Coverage Status][coverage-status-image]][coverage-status-url]
[![License][license-image]][license-url]

Youngfounder Indonesia Bridging Application using Express.js.

## Table of Contents

- [YFID Express.js](#yfid-expressjs)
  - [Table of Contents](#table-of-contents)
  - [Requirement](#requirement)
  - [Installation](#installation)
  - [Preparing The Database](#preparing-the-database)
  - [Running in Development Environment](#running-in-development-environment)
  - [Testing](#testing)
  - [Changelog](#changelog)
  - [Contributing](#contributing)
  - [License](#license)
  - [Credits](#credits)

## Requirement

- Node.js ^20.11.0
- PostgreSQL ^16.1

## Installation

You can install the project by clone it via GitHub :

```bash
git clone https://github.com/youngfounderid/yfid-expressjs.git
npm install
npm run key:generate # Generate a new APP_KEY and put it into .env file (use flag "-- --show" to only display the key into the terminal).
```

## Preparing The Database

Create the database environment by yourself using this way below.

- MySQL (<https://dev.mysql.com/doc/refman/8.0/en/creating-database.html>). Use DATABASE_URL as the database configuration.
- MongoDB (<https://www.mongodb.com/basics/create-database>). Use MONGODB_DATABASE_URL as the database configuration.

Then run migrations and seeder by execute the command below.

```bash
npm run migrate:dev
# or
npm run migrate:reset -- --skip-seed # Add flag "--skip-seed" to run the migration without seeding and flag "--source_path=YOUR_ENV_PATH" to change the default .env path value.
```

> Note: This is a development command and should never be used in a production environment. Please use `npm run migrate:deploy` for testing an production environment. Read [prisma migrate documentation][prisma-migrate-documentation-url] for further information.

## Running in Development Environment

You can run this application lively by running this script :

```bash
npm run dev
```

## Testing

```bash
npm run test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

The MIT License (MIT). Please see [License File][license-url] for more information.

## Credits

| Role   | Name                                                     |
| ------ | -------------------------------------------------------- |
| Author | [Septianata Rizky Pratama](https://github.com/ianriizky) |

[build-status-image]: https://github.com/youngfounderid/yfid-expressjs/actions/workflows/nodejs-ci.yml/badge.svg
[build-status-url]: https://github.com/youngfounderid/yfid-expressjs/actions/workflows/nodejs-ci.yml
[coverage-status-image]: https://codecov.io/gh/youngfounderid/yfid-expressjs/branch/main/graph/badge.svg
[coverage-status-url]: https://codecov.io/gh/youngfounderid/yfid-expressjs
[license-image]: https://badgen.net/static/license/MIT/blue
[license-url]: LICENSE.md
[prisma-migrate-documentation-url]: https://www.prisma.io/docs/orm/prisma-migrate
