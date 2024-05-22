
const User = require('../models/userModel');
const mongoose = require( "mongoose" );
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const getStudentsByCourse = async (event) => {

  try {
      const jwtResult = await jwtMiddleware(event);
      if (jwtResult) { return jwtResult; }

      await connectToDatabase();
    
      const { courseId } = event.pathParameters;
      
      const usersBelongCourse = await User.aggregate([
        // { $match: { course: new mongoose.Types.ObjectId(courseId) } }, // Filtrar usuarios por rol
        { $match: { course: new mongoose.Types.createFromTime(courseId) } }, // Filtrar usuarios por rol
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
        body: JSON.stringify(usersBelongCourse)
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

module.exports = { getStudentsByCourse };