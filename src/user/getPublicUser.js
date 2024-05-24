
const User = require('../models/userModel');
const connectToDatabase = require('../../middleware/db');

const getPublicUser = async (event) => {

  try {

    await connectToDatabase();

    const { mySearch } = event.pathParameters;
    
    const user = await User.findOne({document: parseInt(mySearch)});

    if(!user) {
      return {
        statusCode: 200,
        body: false
      };
    }

    return {
      statusCode: 200,
      body: true
    };
  } catch (error) {

    console.log("Error catch");
    console.log(error);
    
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
  

}

module.exports = { getPublicUser };