const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const sign = mongoose.model("Sign", signSchema);

module.exports = sign;
