
const User = require('../models/userModel');
const mongoose = require( "mongoose" );
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const addStudentUser = async (event) => {

  try {
    
    const jwtResult = await jwtMiddleware(event, true);
    if (jwtResult) { return jwtResult; }

    await connectToDatabase();
    
    const { fullName, email, phone, documentType, document, birthday, courseId  } = JSON.parse(event.body);
  
    const query = {
      fullName,
      email,
      phone,
      document_type: documentType,
      document,
      birthday,
      rol: 'student',
      course: courseId,
      created_by: event.user._id
    };

    const newStudent = new User(query);
    await newStudent.save();

    const populateUser = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(newStudent._id) } }, // Filtrar usuario
      {
        $lookup: {
          from: "courses", // El nombre de la colección de cursos en la base de datos
          localField: "course", // La clave en la colección de usuarios
          foreignField: "_id", // La clave en la colección de cursos
          as: "courseDetails" // El nombre del nuevo campo que contendrá los datos del curso
        }
      },
      {
        $unwind: {
          path: "$courseDetails",
          preserveNullAndEmptyArrays: true // Para mantener a los usuarios que no tienen cursos asignados
        }
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          rol: 1,
          phone: 1,
          document_type: 1,
          document: 1,
          birthday: 1,
          created_at: 1,
          course: {
            // Estructura los detalles del curso como desees mostrarlos
            promotion: "$courseDetails.promotion",
            type_description: "$courseDetails.type_description",
            type: "$courseDetails.type",
            created_at: "$courseDetails.created_at",
            _id: "$courseDetails._id"
          }
        }
      }
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(populateUser[0])
    };
  } catch (error) {
    console.log("Error en creacion de estudiante");
    console.log(error);
    return {
      statusCode: 400,
      body: 'Error al intentar un estudiante'
    };
  }


}

module.exports = { addStudentUser };