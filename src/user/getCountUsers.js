
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const getCountUsers = async (event) => {

  const jwtResult = await jwtMiddleware(event);
  if (jwtResult) { return jwtResult; }

  await connectToDatabase();

  const users = await User.find();
  const courses = await Course.find();

  const intructors = users.filter(user => user.rol === 'instructor');
  const students = users.filter(user => user.rol === 'student');

  const count = {
    instructors: intructors.length,
    students: students.length,
    courses: courses.length
  };

  return {
    statusCode: 200,
    body: JSON.stringify(count)
  };

}

module.exports = { getCountUsers };