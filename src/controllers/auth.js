const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const env = process.env.STAGE_ENVIRONMNET;
const TableName = `users-${env}`;

const signUp = async (req, res) => {
  const params = {
    TableName,
  };
  const { password, email } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
    params["Item"] = { email, password: hash };
    docClient.put(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to add item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        res.send(new Error(err));
      } else {
        const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
          expiresIn: 600,
        });
        res.json({
          message: `Item created successfully. ${JSON.stringify(params)}.`,
          auth: true,
          token: token,
        });
      }
    });
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const params = {
    TableName,
    KeyConditionExpression: `email = :email`,
    ExpressionAttributeValues: {
      ":email": email,
    },
    Limit: 1,
  };
  docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log(data.Items);
      if (data.Items.length > 0) {
        bcrypt.compare(password, data.Items[0].password, (error, response) => {
          if (response) {
            const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
              expiresIn: 600,
            });
            res.json({ auth: true, token: token }); //everything is sent (even password!!!)
          } else {
            res.send({
              auth: false,
              message: "wrong user-password combination",
            });
          }
        });
      } else {
        res.send({ auth: false, message: "No user exist" });
      }
    }
  });
};

module.exports = { signIn, signUp };
