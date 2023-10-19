import express from "express";
import { RegisterUser, Login } from "../Controllers/UserController.ts";
const router = express.Router();

router.post("/login", Login);
router.post("/register", RegisterUser);
router.get("/surveyes", (req: express.Request, res: express.Response) => {});
router.get("/surveyes/:id");

export default router;
