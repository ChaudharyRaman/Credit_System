// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/register', customerController.createCustomer);
router.post('/check-eligibility', customerController.checkEligibility);

module.exports = router;
