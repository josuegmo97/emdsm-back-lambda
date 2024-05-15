const jwt = require('jsonwebtoken');

const jwtMiddleware = async (event, isAdmin = false) => {
  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    return {
      statusCode: 401,
      body: "Token no proporcionado",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Asegúrate de tener JWT_SECRET en tus variables de entorno
    event.user = decoded.user; // Añade el usuario decodificado al evento para uso posterior

    if (isAdmin && event.user.rol !== 'admin') {
      return {
        statusCode: 401,
        body: "No autorizado",
      };
    }

    return null; // Devuelve null si la validación es exitosa
  } catch (error) {
    return {
      statusCode: 401,
      body: "Token inválido",
    };
  }
};

module.exports = {
  jwtMiddleware
};
