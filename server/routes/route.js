import express from "express";
import userController from "../controllers/userController.js";
import token from "../middlewares/token.js";

const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.put("/update-password", token.auth, userController.updatePassword);
// router.get("followers")

export default router;
