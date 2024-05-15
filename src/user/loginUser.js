
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const loginUser = async (event) => {

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    
    const { email, photoUrl } = JSON.parse(event.body);

    // get user by email
    const params = {
      TableName: 'UsersTable',
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await dynamoDB.query(params).promise();
    const Item = result.Items[0];

    if(!Item) {
      return {
        statusCode: 404,
        body: "Usuario no encontrado"
      };
    }

    if(Item.rol !== 'admin' && Item.rol !== 'instructor') {
      return {
        statusCode: 403,
        body: "Usuario no autorizado"
      };
    }

    const user = {
      ...Item,
      photoUrl
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