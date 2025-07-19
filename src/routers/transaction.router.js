const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, transactionController.createTransaction);

router.get('/', authMiddleware, transactionController.getAllTransactions);



module.exports = router;
