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
      res.send(new Error(err));
    } else {
      console.log("Scan succeeded.");
      res.send(data.Items);
    }
  }
});

router.get("/pagination/:items/:exclusiveStartKey?", async (req, res) => {
  const ExclusiveStartKey = req.params.exclusiveStartKey && {
    id: req.params.exclusiveStartKey,
  };
  const params = {
    TableName: PHONE_TABLE_NAME,
    ProjectionExpression: "id, #n, thumbnailFileName, price",
    ExpressionAttributeNames: { "#n": "name" },
    KeyConditionExpression: "*",
    Limit: parseInt(req.params.items),
    ExclusiveStartKey,
  };

  console.log("Querying Phone table.");
  docClient.scan(params, onQuery);

  function onQuery(err, data) {
    if (err) {
      console.error(
        "Unable to query the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Query succeeded.");

      res.send({
        newItems: data.Items,
        lastEvaluatedKey: data.LastEvaluatedKey.id,
      });
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
      res.send(new Error(err));
    } else {
      console.log("Query succeeded.");
      res.send(data.Items);
    }
  });
});

router.post("/", async (req, res) => {
  console.log({ req });
  const params = {
    TableName: PHONE_TABLE_NAME,
    Item: req.body,
  };
  console.log({ params });
  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send(new Error(err));
    } else {
      console.log("Added item:", JSON.stringify(req, null, 2));
      res.send(data);
    }
  });
});

router.delete("/:id", async (req, res) => {
  const params = {
    TableName: PHONE_TABLE_NAME,
    Key: { id: req.params.id },
  };

  docClient.delete(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send(new Error(err));
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
});

router.put("/", async (req, res) => {
  const id = req.body.id;

  const params = {
    TableName: PHONE_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set #n=:n, manufacturer=:m, description=:d, color=:c, price=:p, memory=:me, screen=:s, processor=:pro, ram=:r",
    ExpressionAttributeNames: { "#n": "name" },
    ExpressionAttributeValues: {
      ":n": req.body.name,
      ":m": req.body.manufacturer,
      ":d": req.body.description,
      ":c": req.body.color,
      ":p": req.body.price,
      ":me": req.body.memory,
      ":s": req.body.screen,
      ":pro": req.body.processor,
      ":r": req.body.ram,
    },
  };
  console.log({ id, params });
  docClient.update(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to update item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send(new Error(err));
    } else {
      console.log("Updated item succeeded:", JSON.stringify(data, null, 2));
    }
  });
});

module.exports = router;
