
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const getCountUsers = async (event) => {

  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }
  
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const users = await dynamoDB.scan({
    TableName: 'UsersTable'
  }).promise();

  const courses = await dynamoDB.scan({
    TableName: 'CoursesTable'
  }).promise();

  const intructors = users.Items.filter(user => user.rol === 'instructor');
  const students = users.Items.filter(user => user.rol === 'student');

  const count = {
    instructors: intructors.length,
    students: students.length,
    courses: courses.Items.length
  };

  return {
    statusCode: 200,
    body: JSON.stringify(count)
  };

}

module.exports = { getCountUsers };