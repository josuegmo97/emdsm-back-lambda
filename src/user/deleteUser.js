
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const { jwtMiddleware } = require('../../middleware/jwt');

const deleteUser = async (event) => {

  try {
      const jwtResult = await jwtMiddleware(event, true);
      if (jwtResult) { return jwtResult; }
      
      await connectToDatabase();

      const { id  } = JSON.parse(event.body);

      await User.findOneAndDelete({_id: id});

      return {
        statusCode: 200,
        body: 'Usuario eliminado correctamente'
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

module.exports = { deleteUser };