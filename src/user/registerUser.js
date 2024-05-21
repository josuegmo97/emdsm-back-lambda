
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');
const argon2 = require('argon2');

const registerUser = async (event) => {

  try {
    
    await connectToDatabase();

    const { document, code, password, username } = JSON.parse(event.body);

    const query = await User.findOne({ document, code });

    const checkUsername = await User.findOne({ username });

    if(checkUsername) {
      return {
        statusCode: 400,
        body: 'El usuario ya existe'
      };
    }

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

    
    query.username = username;
    query.password = await argon2.hash(password, {
      timeCost: 1,       // Número mínimo de iteraciones
      memoryCost: 2**12, // Memoria mínima en kibibytes (4,096 kibibytes)
      parallelism: 1,    // Número mínimo de hilos paralelos
      type: argon2.argon2id // Tipo de algoritmo recomendado por seguridad
    });
    query.code = null;
    await query.save();

    return {
      statusCode: 200,
      body: 'Usuario registrado correctamente'
    };
  } catch (error) {

    console.log("Catch error");
    console.log(error);

    return {
      statusCode: 400,
      body: "Registro fallido"
    };
  }


}

module.exports = { registerUser };