import { Router } from "express";

const router = Router();

import { loginController, registerController } from "../controllers/auth.controller";

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// delete account {PROTECTED}
// router.delete("/delete");

export default router;
