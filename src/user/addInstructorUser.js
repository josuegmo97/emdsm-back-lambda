
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const addInstructorUser = async (event) => {

  const jwtResult = await jwtMiddleware(event, true);
  if (jwtResult) { return jwtResult; }
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { fullName, email, phone, documentType, document, birthday  } = JSON.parse(event.body);
  const created_at = new Date().toISOString();
  const id = v4();

  const newInstructor = {
    id,
    fullName,
    email,
    phone,
    document_type: documentType,
    document,
    birthday,
    created_at,
    rol: 'instructor',
    course_id: null,
    created_by: event.user.id
  };

  await dynamoDB.put({
    TableName: 'UsersTable',
    Item: newInstructor
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newInstructor)
  };


}

module.exports = { addInstructorUser };