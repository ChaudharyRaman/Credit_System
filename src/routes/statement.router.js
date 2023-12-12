// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const statementController = require('../controllers/statementController');


router.get('/:customer_id/:loan_id',statementController.getStatement)
module.exports = router;
