
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const getCourse = async (event) => {
  
  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const { Item } = await dynamoDB.get({
    TableName: 'CoursesTable',
    Key: { id }
  }).promise();

  
  return {
    statusCode: 200,
    body: JSON.stringify(Item)
  };

}

module.exports = { getCourse };