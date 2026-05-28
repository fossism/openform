const Response = require('../models/Response');
const Form = require('../models/Form');

// @desc    Submit a response
// @route   POST /api/responses
// @access  Public (or semi-public depending on form)
const submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (!form.isAcceptingResponses) {
      return res.status(400).json({ message: 'This form is no longer accepting responses' });
    }

    const response = await Response.create({
      form: formId,
      answers,
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get responses for a form
// @route   GET /api/responses/:formId
// @access  Private (Creator only)
const getFormResponses = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to view these responses' });
    }

    const responses = await Response.find({ form: req.params.formId }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitResponse,
  getFormResponses
};
