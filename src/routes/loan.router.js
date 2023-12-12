// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/',loanController.createLoan)
router.get('/:loan_id',loanController.viewLoan)

module.exports = router;
