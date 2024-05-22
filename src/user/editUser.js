
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const editUser = async (event) => {

  try {
      const jwtResult = await jwtMiddleware(event, true);
      if (jwtResult) { return jwtResult; }
      
      await connectToDatabase();

      const { fullName, phone, documentType, document, birthday, id  } = JSON.parse(event.body);

      const user = await User.findOne({_id: id});

      if(!user) {
        return {
          statusCode: 400,
          body: 'El usuario no existe'
        };
      }

      const newValues =
      {
        fullName,
        phone,
        document_type: documentType,
        document,
        birthday,
      };

      // Actualiza solo los valores que han cambiado
      Object.keys(newValues).forEach(key => {
        if (newValues[key] !== undefined && user[key] !== newValues[key]) {
          user[key] = newValues[key];
        }
      });

      // Guarda el documento actualizado
      await user.save();
    
      return {
        statusCode: 200,
        body: 'Usuario actualizado correctamente'
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

module.exports = { editUser };