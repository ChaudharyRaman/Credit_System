// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.get('/:customer_id/:loan_id',paymentController.makePayment)
module.exports = router;
