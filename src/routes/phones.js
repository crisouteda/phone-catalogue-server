const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const PHONE_TABLE_NAME = "phone-data-staging";

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  var params = {
    TableName: PHONE_TABLE_NAME,
    ProjectionExpression: "id, #n, thumbnailFileName, price",
    ExpressionAttributeNames: { "#n": "name" },
  };
  console.log("Scanning Phone table.");
  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Scan succeeded.");
      res.send(data.Items);
    }
  }
});

router.get("/pagination/:items/:page", async (req, res) => {
  var params = {
    TableName: PHONE_TABLE_NAME,
    ProjectionExpression: "id, #n, thumbnailFileName, price",
    ExpressionAttributeNames: { "#n": "name" },
  };
  console.log("Scanning Phone table.");
  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Scan succeeded.");
      const page = parseInt(req.params.page);
      const items = parseInt(req.params.items);
      const maxItem =
        (page + 1) * items < data.Items.length - 1
          ? (page + 1) * items
          : data.Items.length - 1;
      const pageItems = data.Items.slice(page * items, maxItem);
      res.send(pageItems);
    }
  }
});

router.get("/:id", async (req, res) => {
  const params = {
    TableName: PHONE_TABLE_NAME,
    KeyConditionExpression: `id = :id`,
    ExpressionAttributeValues: {
      ":id": req.params.id,
    },
    Limit: 1,
  };

  docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      res.send(data);
      data.Items.forEach(function (item) {
        console.log(" -", item.year + ": " + item.title);
      });
    }
  });
});

router.post("/", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

router.put("/", async (req, res) => {
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
