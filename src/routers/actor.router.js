const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actor.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', actorController.getAllActors)
router.post('/', authMiddleware, actorController.createActor);

module.exports = router;
