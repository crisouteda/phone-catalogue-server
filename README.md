# Phone Catalogue - Server side

Backend for phone catalogue management. Frontend can be found in the following repository: [phone-catalogue-client](https://github.com/crisouteda/phone-catalogue-client)

to `prod` branch in Github, heroku will run

## ⚙️ endpoints

### /auth/signup

parameters: body containing email and password

method: POST

description: hashes the password and ads the hashed password and the email to the database. Returns a token which the user must send to have access to some endpoints

### /auth/signin

parameters: body containing email and password

method: POST

description: checks if the email introduced exists. If exists it checks if the hashed password in the database matched the password send in the body. Returns a token if passwords match.

### /phones

parameters: none

method: GET

description: list the basic information (id, name, price and thumbnailFileName) for every phone

### /phones/pagination/:items/:exclusiveStartKey

parameters:

- `items`: \*[Required] number of items to retrieve.
- `exclusiveStartKey`: item from which the query will start

method: GET

description: lists the number of items requested from the exclusiveStartKey item. Returns basic information only (id, name, price and thumbnailFileName). Useful for pagination in frontend

### /phones/:id

parameters:

- id: phone id

method: GET

description: list all the available information for the requested phone

### /phones

parameters: body containig phone data and token for access validation. See example:

```json
"body": {
    "token": "randomTOKENhere",
    "screen": "1080 x 2400 pixels",
    "memory": "128GB 6GB RAM",
    "name": "Galaxy S20 FE 2022",
    "imageFileName":"https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s20-fe-5g-1.jpg",
    "manufacturer": "Samsung",
    "thumbnailFileName":"https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s20-fe-5g.jpg",
    "price": "About 520 EUR"
}
```

method: POST

description: adds a new phone to the database

### /phones/delete

parameters: body containing object with phone id and authorization token.

```json
"body": {
        "id": "ef09f910-21c5-4682-9794-767e208028ec",
        "token": "randomTOKENhere",
}
```

method: POST

description: removes phone from database by id

### /phones

parameters: body containig phone data and authorization token. Every key in the following example must be sent:

```json
"body": {
        "token": "randomTOKENhere",
        "id": "ef09f910-21c5-4682-9794-767e208028ec",
        "name": "Galaxy S20 FE 2022",
        "manufacturer": "Samsung",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nam libero justo laoreet sit amet cursus. Ac orci phasellus egestas tellus rutrum tellus pellentesque",
        "color": "Cloud White, Cloud Lavender, Cloud Navy",
        "price": "About 540 EUR",
        "screen": "1080 x 2400 pixels",
        "processor": "Snapdragon 845",
        "ram": 0,
        "memory": "128GB 6GB RAM",
}
```

method: POST

description: updates phone information in the database by id

## 💻 Development

These instructions will allow you to get a working copy of the project on your local machine for development and testing purposes.

### 📋 Prerequisites

You need to have installed Node JS. Developed with v17.9.0.
Also, an account in Amazon Web Services (AWS) is needed.

### 🔧 Installation

1. Download this repository as zip or clone the repository on your device (if you clone the repository, note that you will not be able to add your commits).
2. Open a terminal in the root directory of the repository.
3. Install the local dependencies by running the command in the terminal:

```
npm install
```

or

```
yarn
```

4. Some environmental variables are needed. Create a .env file with the following keys:

- **AWS_ACCESS_KEY_ID**: Specifies an AWS access key associated with an IAM user or role.
- **AWS_SECRET_ACCESS_KEY**: Specifies the secret key associated with the access key. This is essentially the "password" for the access key.
- **AWS_DEFAULT_REGION**: Specifies the AWS Region to send the request to.
- **TOKEN_SECRET**: random secret to hash passwords
- **STAGE_ENVIRONMNET**: to handle the environment and used to call the right database. staging and prod have been used

### 🏁 Starting the project

To serve the app locally run:

```
npm run start
```

or

```
yarn start
```

If you want to re-run the server every time you change the code source:

```
npm run watch
```

or

```
yarn watch
```

### 🚀 Deployment to Heroku

The present backend is deployed in [Heroku](https://devcenter.heroku.com/categories/reference), a CI/CD tool.

- [staging](https://phone-catalogue-server-staging.herokuapp.com/)
  Push the changes to `main` branch in Github, heroku will run

- [prod](https://phone-catalogue-server.herokuapp.com/)
  Push to changes

## 🛠️ Tools

### Database

- The databse used is DynamoDB. It has been chosen for being a NoSQL database. This gives some extra flexibility to the data and the phone providers to add the data they prefer about the phone specifications. This particular NoSQL database was selected because AWS provides a SDK to handle easily and fast the CRUD actions. aws-sdk (version ^2.1110.0)

## 📝 Following improvements and TODOS

- DELETE and PUT requests have been changed to be POST requests because of an error with CORS when calling the endpoints from the frontend.

- Token must be send in the body instead of in the headers because of an error with CORS when calling the endpoints from the frontend.
