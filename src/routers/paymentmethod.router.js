const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentmethod.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', paymentMethodController.getAllPaymentMethods)
router.post('/', authMiddleware,  paymentMethodController.createPaymentMethod);

module.exports = router