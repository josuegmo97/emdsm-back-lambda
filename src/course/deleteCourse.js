
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const deleteCourse = async (event) => {

  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  // delete course
  await dynamoDB.delete({
    TableName: 'CoursesTable',
    Key: { id }
  }).promise();
  
  return {
    statusCode: 200,
    body: "Curso eliminado con éxito"
  };

}

module.exports = { deleteCourse };