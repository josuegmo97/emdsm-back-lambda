const mongoose = require('mongoose');

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return Promise.resolve();
  }

  console.log('=> Using new database connection');
  return mongoose.connect(process.env.MONGO_URI).then(db => {
    isConnected = db.connections[0].readyState;
  }).catch(err => {
    console.log("BD error:");
    console.log(err);
  });
};

module.exports = connectToDatabase;