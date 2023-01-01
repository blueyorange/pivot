const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }],
  expired: { type: Boolean },
});

module.exports = mongoose.model("Poll", PollSchema);
