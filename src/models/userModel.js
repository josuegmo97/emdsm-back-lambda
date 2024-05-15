const mongoose = require( "mongoose" );

const UserSchema = new mongoose.Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    index: true,
  },
  url: {
    type: Schema.Types.String,
    required: true,
    index: true,
  },
  types: [
    {
      type: Schema.Types.String,
    },
  ],
  currencies: [
    {
      type: Schema.Types.ObjectId,
      ref: "currency",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: false,
    index: true,
  },
  created_at: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

UserSchema.methods.toJSON = function () {
  let report = this;
  let reportObject = report.toObject();
  // delete reportObject._id;
  delete reportObject.__v;
  return reportObject;
};

const Report = mongoose.model("report", UserSchema);

export default Report;
