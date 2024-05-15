
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const getStudentsByCourse = async (event) => {

  try {
      const jwtResult = await jwtMiddleware(event);
      if (jwtResult) { return jwtResult; }
    
      const { courseId } = event.pathParameters;
      
      const dynamoDB = new AWS.DynamoDB.DocumentClient();
    
      // const params = {
      //   TableName: 'UsersTable',
      //   IndexName: 'courseIdIndex', // Nombre del índice secundario global
      //   KeyConditionExpression: '#courseId = :courseIdValue',
      //   ExpressionAttributeNames: {
      //     '#courseId': 'courseId' // Alias para el atributo courseId
      //   },
      //   ExpressionAttributeValues: {
      //     ':courseIdValue': courseId
      //   }
      // };
    
      // const { Items} = await dynamoDB.query(params).promise();
    
      const { Items } = await dynamoDB.scan({
        TableName: 'UsersTable',
        FilterExpression: 'course_id = :course_id',
        ExpressionAttributeValues: {
          ':course_id': courseId
        }
      }).promise();
    
      return {
        statusCode: 200,
        body: JSON.stringify(Items)
      };
  } catch (error) {

    console.log("Errorrrrrrrrrr");
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  } 



}

module.exports = { getStudentsByCourse };