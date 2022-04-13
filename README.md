# Phone Catalogue - Server side

Backend for phone catalogue management

### Deployment

The present backend is deployed in [Heroku](https://devcenter.heroku.com/categories/reference), a CI/CD tool.

- [staging](https://phone-catalogue-server-staging.herokuapp.com/)
  Push the changes to `main` branch in Github, heroku will run

- [prod](https://phone-catalogue-server.herokuapp.com/)
  Push to changes to `prod` branch in Github, heroku will run

## endpoints

### /phones

parameters: none

method: GET

description: list the basic information (id, name, price and thumbnailFileName) for every phone

### /phones/pagination/:items/:exclusiveStartKey

parameters:

- items: number of items to retrieve
- exclusiveStartKey: last item retrieved

method: GET

description: lists the number of items requested from the exclusiveStartKey item. Returns basic information only (id, name, price and thumbnailFileName). Useful for pagination in frontend

### /phones/:id

parameters:

- id: phone id

method: GET

description: list all the available information for the requested phone

### /phones

parameters: body containig data object. See example:

```json
"body": {
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

### /phones/:id

parameters: phone id

method: DELETE

description: removes phone from database by id

### /phones

parameters: body containig data object. Every key in the following example must be sent:

```json
"body": {
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

method: PUT

description: updates phone information in the database by id
