const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String, // UUID for the question to match responses easily
    required: true,
  },
  type: {
    type: String,
    enum: ['short_text', 'long_text', 'multiple_choice', 'checkboxes', 'dropdown'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: [{
    type: String // Used for multiple_choice, checkboxes, dropdown
  }],
  required: {
    type: Boolean,
    default: false,
  }
});

const formSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [questionSchema],
  isAcceptingResponses: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
