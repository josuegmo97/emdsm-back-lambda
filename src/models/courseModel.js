const mongoose = require( "mongoose" );

const CourseSchema = new mongoose.Schema({

  promotion: {
    type: mongoose.Schema.Types.String,
    required: true,
  },

  type: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },

  type_description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

CourseSchema.methods.toJSON = function () {
  let course = this;
  let courseObject = course.toObject();
  // delete courseObject._id;
  delete courseObject.__v;
  return courseObject;
};

module.exports = mongoose.model("course", CourseSchema);
