
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const getCourses = async (event) => {

  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { Items } = await dynamoDB.scan({
    TableName: 'CoursesTable'
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(Items)
  };

}

module.exports = { getCourses };