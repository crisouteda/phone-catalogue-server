const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const docClient = new AWS.DynamoDB.DocumentClient();
const env = process.env.STAGE_ENVIRONMNET;
const TableName = `phone-data-${env}`;

const getAll = async (req, res) => {
  var params = {
    TableName,
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
      console.log("Scan succeeded.", JSON.stringify(data, null, 2));
      res.send(data.Items);
    }
  }
};

const getAllPagination = async (req, res) => {
  const ExclusiveStartKey = req.params.exclusiveStartKey && {
    id: req.params.exclusiveStartKey,
  };
  const Limit = parseInt(req.params.items);

  const params = {
    TableName,
    ProjectionExpression: "id, #n, thumbnailFileName, price",
    ExpressionAttributeNames: { "#n": "name" },
    KeyConditionExpression: "*",
    Limit,
    ExclusiveStartKey,
  };

  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to query the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send(new Error(err));
    } else {
      console.log("Query succeeded.");
      const limitReached = Limit > data.Count;
      res.send({
        newItems: data.Items,
        lastEvaluatedKey: !limitReached && data.LastEvaluatedKey.id,
        limitReached,
      });
    }
  }
};

const getPhoneById = async (req, res) => {
  const id = req.params.id;
  const params = {
    TableName,
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
      console.log(`Query succeeded. Returned item with id=${id}`);
      res.send(data.Items);
    }
  });
};

const createPhone = async (req, res) => {
  const { data } = req.body;
  const params = {
    TableName,
    Item: { ...JSON.parse(data), id: uuidv4() },
  };
  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send(new Error(err));
    } else {
      console.log("Added item:", params.Item.id);
      res.send({
        message: `Item created successfully.`,
        id: params.Item.id,
      });
    }
  });
};

const deletePhoneById = async (req, res) => {
  const params = {
    TableName,
    Key: { id: req.body.id },
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
      res.send({
        message: `Item with id=${req.body.id} deleted successfully.`,
      });
    }
  });
};

const updatePhone = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const id = data.id;
  const params = {
    TableName,
    Key: { id },
    UpdateExpression:
      "set #n=:n, manufacturer=:m, description=:d, color=:c, price=:p, memory=:me, screen=:s, processor=:pro, ram=:r",
    ExpressionAttributeNames: { "#n": "name" },
    ExpressionAttributeValues: {
      ":n": data.name,
      ":m": data.manufacturer,
      ":d": data.description,
      ":c": data.color,
      ":p": data.price,
      ":me": data.memory,
      ":s": data.screen,
      ":pro": data.processor,
      ":r": data.ram,
    },
  };
  docClient.update(params, onUpdate);
  function onUpdate(err, dat) {
    if (err) {
      console.error(
        "Unable to update item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send(new Error(err));
    } else {
      console.log("Updated item succeeded:", JSON.stringify(dat, null, 2));
      res.send({ data, message: `Item with id=${id} updated successfully.` });
    }
  }
};

module.exports = {
  getAll,
  getAllPagination,
  getPhoneById,
  createPhone,
  deletePhoneById,
  updatePhone,
};
