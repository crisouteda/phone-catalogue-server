const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const PHONE_TABLE_NAME = "phona-data-staging";

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/getPhone/:id", async (req, res) => {
  const params = {
    TableName: PHONE_TABLE_NAME,
    Key: {
      id: req.params.id,
    },
  };
  try {
    const phonesData = await docClient.scan(params).promise();
    res.send(phonesData);
  } catch (err) {
    console.log(err);
  }
});

router.post("/addPhone", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Item: req.body,
  };
  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
});

router.delete("/removePhoneById/:id", async (req, res) => {
  const params = {
    TableName: table,
    Key: { id: req.params.id },
  };

  docClient.delete(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
});

router.put("/updatePhoneById", async (req, res) => {
  const id = req.body.id;
  const params = {
    TableName: table,
    Key: { id },
    UpdateExpression:
      "set name=:n, manufacturer=:m, description=:d, color=:c, price:p, imageFileName:i, screen:s, processor:pro, ram:r",
    ExpressionAttributeValues: {
      ":n": req.body.name,
      ":m": req.body.manufacturer,
      ":d": req.body.description,
      ":c": req.body.color,
      ":p": req.body.price,
      ":i": req.body.image,
      ":s": req.body.screen,
      ":pro": req.body.processor,
      ":r": req.body.ram,
    },
  };
  docClient.update(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
});

module.exports = router;
