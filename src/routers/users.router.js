const userRouter = require("express").Router();

const userController = require("../controllers/users.controller")

userRouter.get("/", userController.listAllUsers);
userRouter.get("/:id", userController.detailUser);
userRouter.post("/", userController.createUser);
userRouter.patch("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser)

module.exports = userRouter