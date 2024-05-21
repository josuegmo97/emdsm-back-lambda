
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const loginUser = async (event) => {

  try {
    
    await connectToDatabase();

    const { username, password } = JSON.parse(event.body);

    const query = await User.findOne({ username });

    if(!query) {
      return {
        statusCode: 400,
        body: "Usuario no encontrado"
      };
    }

    if(query.rol !== 'admin' && query.rol !== 'instructor') {
      return {
        statusCode: 400,
        body: "Usuario no autorizado"
      };
    }

    if (!(await argon2.verify(query.password, password))) {
      return {
      statusCode: 400,
      body: "Contraseña incorrecta"
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

    console.log("Catch error");
    console.log(error);

    return {
      statusCode: 400,
      body: "Login error"
    };
  }


}

module.exports = { loginUser };