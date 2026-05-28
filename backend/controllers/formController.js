const Form = require('../models/Form');

// @desc    Create a new form
// @route   POST /api/forms
// @access  Private (Creator)
const createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    if (req.user.role !== 'creator') {
      return res.status(403).json({ message: 'Only creators can create forms' });
    }

    const form = await Form.create({
      creator: req.user.id,
      title,
      description,
      questions: questions || [],
    });

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all forms for a user
// @route   GET /api/forms
// @access  Private
const getForms = async (req, res) => {
  try {
    let forms;
    if (req.user.role === 'creator') {
      forms = await Form.find({ creator: req.user.id }).sort({ createdAt: -1 });
    } else {
      forms = await Form.find({ isAcceptingResponses: true }).sort({ createdAt: -1 });
    }
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get form by ID
// @route   GET /api/forms/:id
// @access  Public (for filling out)
const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update form
// @route   PUT /api/forms/:id
// @access  Private (Creator)
const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this form' });
    }

    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete form
// @route   DELETE /api/forms/:id
// @access  Private (Creator)
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this form' });
    }

    await form.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm
};
