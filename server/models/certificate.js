const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  issuedBy: {
    type: String,
    default: "Amdox"
  },
  status: {
    type: String,
    default: "Verified"
  }
});

module.exports = mongoose.model("Certificate", certificateSchema);