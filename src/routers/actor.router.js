const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actor.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminCheck = require('../middlewares/admin.middleware');

router.get('/', actorController.getAllActors)
router.post('/', authMiddleware, adminCheck, actorController.createActor);

module.exports = router;
