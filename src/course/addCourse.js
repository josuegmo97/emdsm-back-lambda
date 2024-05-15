
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { jwtMiddleware } = require('../../middleware/jwt');

const _setCourseType = (type) => {

  switch (type) {
    case '1':
    case 1:
      return 'Piloto Intermedio';
    case '2':
    case 2:
      return 'Piloto Experto';
    default:
      return 'Desconocido';
  }
}

const addCourse = async (event) => {

  try {
    const jwtResult = await jwtMiddleware(event, true);
    if (jwtResult) { return jwtResult; }
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    const { promotion, type } = JSON.parse(event.body);

    const created_at = new Date().toISOString();
    const id = v4();

    const params = {
      TableName: 'CoursesTable',
      IndexName: 'promotionIndex', // Nombre del índice secundario global
      KeyConditionExpression: '#promotion = :promotionValue',
      ExpressionAttributeNames: {
        '#promotion': 'promotion' // Alias para el atributo promotion
      },
      ExpressionAttributeValues: {
        ':promotionValue': promotion
      }
    };

    const checkData = await dynamoDB.query(params).promise();

    if (checkData.Count > 0) {
      return {
        statusCode: 400,
        body: `La promoción #${promotion} ya existe`
      };
    }

    const newCourse = {
      id,
      promotion,
      type, // 1 - Intermedio 2 - Experto
      type_description: _setCourseType(type),
      created_at,
      created_by: event.user.id
    };

    await dynamoDB.put({
      TableName: 'CoursesTable',
      Item: newCourse,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newCourse)
    };
  } catch (error) {

    return {
      statusCode: 400,
      body: 'Error al intentar crear la promoción'
    };


  }

}

module.exports = { addCourse };