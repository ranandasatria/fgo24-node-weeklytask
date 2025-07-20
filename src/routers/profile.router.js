const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const path = require("node:path");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("uploads", "profile-picture"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const savedName = `${uuid()}${ext}`; 
    cb(null, savedName);
  },
});

const profilePicture = multer({ storage });


router.get('/', authMiddleware, profileController.getProfile);
router.patch('/', authMiddleware, profilePicture.single("picture"), profileController.updateProfile)

module.exports = router