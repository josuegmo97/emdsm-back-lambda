const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const addInstructorUser = async (event) => {

  try {
    const jwtResult = await jwtMiddleware(event, true);
    if (jwtResult) { return jwtResult; }
    
    await connectToDatabase();

    const { fullName, email, phone, documentType, document, birthday  } = JSON.parse(event.body);

    const query = {
      fullName,
      email,
      phone,
      document_type: documentType,
      document,
      birthday,
      rol: 'instructor',
      course: null,
      created_by: event.user._id
    };

    const newInstructor = new User(query);
    await newInstructor.save();

    return {
      statusCode: 200,
      body: JSON.stringify(newInstructor)
    };
  } catch (error) {
    
    console.log(error);

    return {
      statusCode: 400,
      body: 'Error al intentar crear el instructor'
    };
  }
  


}

module.exports = { addInstructorUser };