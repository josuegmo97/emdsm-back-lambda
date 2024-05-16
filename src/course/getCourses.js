
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const getCourses = async (event) => {

  try {
      const jwtResult = await jwtMiddleware(event);
      if (jwtResult) { return jwtResult; }
      
      await connectToDatabase();
    
      const courses = await Course.find();
    
      // Obtener el conteo de usuarios para cada curso
      const coursesWithUserCounts = await Promise.all(courses.map(async (course) => {
        const userCount = await User.countDocuments({ course_id: course._id });
        return {
          ...course._doc,
          students: userCount
        };
      }));
    
      return {
        statusCode: 200,
        body: JSON.stringify(coursesWithUserCounts)
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