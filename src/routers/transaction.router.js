const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminCheck = require('../middlewares/admin.middleware');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/admin/transactions', authMiddleware, adminCheck, transactionController.getAllTransactions);
router.get('/', authMiddleware, transactionController.getTransactionsByUser);

module.exports = router;
