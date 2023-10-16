import express from "express";
import { RegisterUser, Login } from "../Controllers/UserController.ts";
const router = express.Router();

router.post("/login", Login);
router.post("/register", RegisterUser);

export default router;
