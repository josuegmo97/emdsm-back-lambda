
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const getCourses = async (event) => {

  try {
      const jwtResult = await jwtMiddleware(event);
      if (jwtResult) { return jwtResult; }
      
      await connectToDatabase();
    
      const courses = await Course.find().sort({"created_at": -1});

      const users = await User.find({rol: 'student'});

      const coursesWithStudents = courses.map(course => {
        const students = users.filter(user => user.course.toString() === course._id.toString());
        return {
          ...course._doc,
          students: students.length
        };
      });
    
      return {
        statusCode: 200,
        body: JSON.stringify(coursesWithStudents)
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

module.exports = { getCourses };