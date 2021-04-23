const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {
    type: Array,
    required: true,
  },
  answer: {
    type: Array,
    required: true,
  },
  correct_answer: {
    type: String,
    required: true,
  },
  image_exists: {
    type: Boolean,
    required: true,
  },
  item_exists: {
    type: Boolean,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const question = mongoose.model("Question", questionSchema);

module.exports = question;
