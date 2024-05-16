const Course = require('../models/courseModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const _setCourseType = (type) => {
  const typeToNumber = parseInt(type);
  switch (typeToNumber) {
    case 1:
      return 'Piloto Intermedio';
    case 2:
      return 'Piloto Experto';
    default:
      return 'Desconocido';
  }
}

const addCourse = async (event) => {

  try {
    const jwtResult = await jwtMiddleware(event, true);
    if (jwtResult) { return jwtResult; }
    
    await connectToDatabase();

    const { promotion, type } = JSON.parse(event.body);

    const course = await Course.findOne({ promotion});

    if (course) {
      return {
        statusCode: 400,
        body: `La promoción #${promotion} ya existe`
      };
    }

    const newCourseQuery = {
      promotion,
      type, // 1 - Intermedio 2 - Experto
      type_description: _setCourseType(type),
      created_by: event.user._id
    };

    const newCourse = new Course(newCourseQuery);
    await newCourse.save();

    return {
      statusCode: 200,
      body: JSON.stringify(newCourse)
    };
  } catch (error) {

    console.log(error);

    return {
      statusCode: 400,
      body: 'Error al intentar crear la promoción'
    };


  }

}

module.exports = { addCourse };