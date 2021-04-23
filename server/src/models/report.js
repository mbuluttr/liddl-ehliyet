const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  question_id: {
    type: String,
    required: true,
  },
  report: {
    type: String,
    required: true,
  },
});

const report = mongoose.model("Report", reportSchema);

module.exports = report;
