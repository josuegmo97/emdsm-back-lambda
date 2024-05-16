
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const jwt = require('jsonwebtoken');

const loginUser = async (event) => {

  try {
    
    await connectToDatabase();

    const { email } = JSON.parse(event.body);

    const query = await User.findOne({ email });

    if(!query) {
      return {
        statusCode: 404,
        body: "Usuario no encontrado"
      };
    }

    if(query.rol !== 'admin' && query.rol !== 'instructor') {
      return {
        statusCode: 403,
        body: "Usuario no autorizado"
      };
    }

    const user = {
      ...query.toJSON(),
    }

    const token = jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET
    );

    return {
      statusCode: 200,
      body: JSON.stringify({user, token})
    };
  } catch (error) {

    return {
      statusCode: 400,
      body: "Login error"
    };
  }


}

module.exports = { loginUser };