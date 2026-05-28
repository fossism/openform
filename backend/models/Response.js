const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be String or Array of Strings for checkboxes
    required: true,
  }
}, { _id: false });

const responseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  answers: [answerSchema],
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);
