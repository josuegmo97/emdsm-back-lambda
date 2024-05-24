const mongoose = require( "mongoose" );

const UserSchema = new mongoose.Schema({
  fullName: {
    type: mongoose.Schema.Types.String,
    required: true,
    index: true,
  },
  phone: {
    type: mongoose.Schema.Types.String,
  },
  rol: {
    type: mongoose.Schema.Types.String,
  },
  birthday: {
    type: mongoose.Schema.Types.String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: false,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  document: {
    type: mongoose.Schema.Types.Number,
    required: true,
    unique: true
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  code: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: null,
  },
  document_type: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  // delete userObject._id;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model("user", UserSchema);

