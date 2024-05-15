
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const addStudentUser = async (event) => {

  try {
    
    const jwtResult = await jwtMiddleware(event, true);
    if (jwtResult) { return jwtResult; }
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
  
    const { fullName, email, phone, documentType, document, birthday, courseId  } = JSON.parse(event.body);
    const created_at = new Date().toISOString();
    const id = v4();
  
    const newStudent = {
      id,
      fullName,
      email,
      phone,
      document_type: documentType,
      document,
      birthday,
      created_at,
      rol: 'student',
      course_id: courseId,
      created_by: event.user.id
    };
  
    await dynamoDB.put({
      TableName: 'UsersTable',
      Item: newStudent
    }).promise();
  
    return {
      statusCode: 200,
      body: JSON.stringify(newStudent)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: 'Error al intentar un estudiante'
    };
  }


}

module.exports = { addStudentUser };