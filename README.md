# Challenge 02 <!-- omit from toc -->

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
  - [`<URL>/client`](#urlclient)
  - [`<URL>/client/:id`](#urlclientid)
- [Technical Details](#technical-details)
    - [Code Editor](#code-editor)
    - [Dependencies](#dependencies)
- [Acknowledgments](#acknowledgments)
  - [Developers:](#developers)
  - [Date](#date)


## Introduction

This is a TypeScript REST API made as the second challenge in the Compass Uol's internship program.
## Getting Started
### Prerequisites
  - Node.js
  - Yarn
### Installation

1. If you are not sure if yarn is installed run: `yarn --version`
    - It should tell you your version of yarn, e.g. `1.22.19`
    - If it is not installed just run: `npm install --global yarn`

2. Clone the GitHub repository in the desired folder:
    - `git clone https://github.com/bruno-ortigosa-cruz/challenge-02`

3. Enter the cloned folder
    - `cd path\of\your\cloned\folder`

4. Install the dependencies with command `yarn`

### Configuration

1. Create a `.env` file on the root folder (in the same level as `package.json`, `README.md`, etc.). There is a `.env.example` to fill if necessary, just remember to rename it to `.env` after
2. Set the variables as below replacing the `<>` fields with your information:
```
MONGO_URI='<your_db_URI>'
PORT=<choose_a_port>
```
**Example:**
```
MONGO_URI='mongodb+srv://my_username:my_password@cluster_name.m8dxk2d.mongodb.net/my_db_name?retryWrites=true&w=majority'
PORT=3000
```
***Note***: if `PORT` is not defined, it is set to `3000` automatically

## Deployment

After all the configuration is set up
1. Enter the `challenge-02` folder
2. Run the `yarn build` command to compile
3. Run the `yarn start` to start the server
4. If you want to test it with swagger enter the url `localhost:<PORT>/api-docs/` in your browser (change `<PORT>` to your port (default `3000`))

## API Endpoints

***Note:*** `<URL>` used in this section means `localhost:<your_port>/api/v1`
### `<URL>/client`
>HTTP Methods
  >- _get_ (get all customers)
  >- _post_ (create a new customer)

### `<URL>/client/:id`
>HTTP Methods
  >- _get_ (get single customer)
  >- _put_ (update an existing customer)
  >- _delete_ (delete an existing customer)
## Technical Details

#### Code Editor
>VSCode

#### Dependencies
```
"@types/body-parser": "^1.19.5",
"@types/express": "^4.17.21",
"@types/node": "^20.9.0",
"@typescript-eslint/eslint-plugin": "^6.10.0",
"@typescript-eslint/parser": "^6.10.0",
"@joi/date": "^2.1.0",
"@types/swagger-ui-express": "^4.1.6",
"eslint": "^8.53.0",
"swagger-ui-express": "^5.0.0",
"eslint-config-prettier": "^9.0.0",
"prettier": "^3.0.3",
"tsc-watch": "^6.0.4"
"body-parser": "^1.20.2",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"express-async-errors": "^3.1.1",
"joi": "^17.11.0",
"mongoose": "^8.0.0",
"typescript": "^5.2.2"
```

## Acknowledgments

### Developers: 
  - Bruno Ortigosa Cruz
  - Camila Rocha Semioni
  - Guilherme Frederico de Carvalho Eisenlohr
  - Kellyson Dias de Almeida
  - Thiago de Jesus Aguiar Alves

### Date
>Done between December 4<sup>th</sup>, 2023 and December 11<sup>th</sup>, 2023