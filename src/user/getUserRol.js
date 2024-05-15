
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const getUserRol = async (event) => {

  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }

  const { rol } = event.pathParameters;
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { Items } = await dynamoDB.scan({
    TableName: 'UsersTable',
    FilterExpression: 'rol = :rol',
    ExpressionAttributeValues: {
      ':rol': rol
    }
  }).promise();


  return {
    statusCode: 200,
    body: JSON.stringify(Items)
  };

}

module.exports = { getUserRol };