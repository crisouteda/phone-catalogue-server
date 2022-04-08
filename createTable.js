const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: "phone-data-staging",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }, //Partition key
  ],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});

// { AttributeName: "name", AttributeType: "S" },
// { AttributeName: "manufacturer", AttributeType: "S" },
// { AttributeName: "description", AttributeType: "S" },
// { AttributeName: "color", AttributeType: "S" },
// { AttributeName: "price", AttributeType: "N" },
// { AttributeName: "imageFileName", AttributeType: "S" },
// { AttributeName: "screen", AttributeType: "S" },
// { AttributeName: "processor", AttributeType: "S" },
// { AttributeName: "ram", AttributeType: "N" },
