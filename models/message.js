const { Datetime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 100 },
  timestamp: { type: Date, required: true },
  author: { type: Schema.ObjectId, ref: "User", required: true },
});

// Virtual for message's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);

