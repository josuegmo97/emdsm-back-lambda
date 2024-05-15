
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const updateCourse = async (event) => {

  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const { name } = JSON.parse(event.body);

  await dynamoDB.update({
    TableName: 'CoursesTable',
    Key: { id },
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': name
    },
    ReturnValues: 'ALL_NEW'
  }).promise();
  
  return {
    statusCode: 200,
    body: "Curso actualizado con éxito"
  };

}

module.exports = { updateCourse };