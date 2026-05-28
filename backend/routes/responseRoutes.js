const express = require('express');
const router = express.Router();
const { submitResponse, getFormResponses } = require('../controllers/responseController');
const { protect } = require('../middleware/auth');

router.post('/', submitResponse);
router.get('/:formId', protect, getFormResponses);

module.exports = router;
