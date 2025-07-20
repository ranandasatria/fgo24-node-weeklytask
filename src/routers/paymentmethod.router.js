const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentmethod.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminCheck = require('../middlewares/admin.middleware');

router.get('/', paymentMethodController.getAllPaymentMethods)
router.post('/', authMiddleware,  adminCheck, paymentMethodController.createPaymentMethod);

module.exports = router