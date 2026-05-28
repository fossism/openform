const express = require('express');
const router = express.Router();
const { createForm, getForms, getFormById, updateForm, deleteForm } = require('../controllers/formController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createForm)
  .get(protect, getForms);

// Public route to get form for answering
router.get('/:id', getFormById);

router.route('/:id')
  .put(protect, updateForm)
  .delete(protect, deleteForm);

module.exports = router;
