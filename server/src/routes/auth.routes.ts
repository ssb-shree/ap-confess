import { Router } from "express";

const router = Router();

import { getUserAuthenticated, loginController, registerController } from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// authUSer
router.get("/check", checkAuth, getUserAuthenticated);

// delete account {PROTECTED}
// router.delete("/delete");

export default router;
