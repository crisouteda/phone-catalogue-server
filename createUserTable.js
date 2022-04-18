const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: "users-staging",
  KeySchema: [
    { AttributeName: "email", KeyType: "HASH" }, //Partition key
  ],
  AttributeDefinitions: [{ AttributeName: "email", AttributeType: "S" }],
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
