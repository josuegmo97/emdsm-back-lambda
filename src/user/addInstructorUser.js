const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const addInstructorUser = async (event) => {

  try {
    const jwtResult = await jwtMiddleware(event, true);
    if (jwtResult) { return jwtResult; }
    
    await connectToDatabase();

    const { fullName, phone, documentType, document, birthday  } = JSON.parse(event.body);

    // Genera un número aleatorio entre 0 y 999999
    let code = Math.floor(Math.random() * 1000000);
      
    // Asegura que el número tenga 6 dígitos, añadiendo ceros al principio si es necesario
    let sixCode = code.toString().padStart(6, '0');

    const query = {
      fullName,
      phone,
      document_type: documentType,
      document,
      birthday,
      rol: 'instructor',
      course: null,
      created_by: event.user._id,
      code: sixCode
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