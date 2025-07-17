const userRouter = require("express").Router();
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

const userController = require("../controllers/users.controller");
const profilePicture = multer({ storage });

userRouter.get("/", userController.listAllUsers);
userRouter.get("/:id", userController.detailUser);
userRouter.post("/", profilePicture.single("picture"), userController.createUser);
// userRouter.patch("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
