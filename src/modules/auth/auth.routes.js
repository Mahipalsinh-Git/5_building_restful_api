import { Router } from "express";

import validate from "../../common/middleware/validate.middleware.js";
import * as controller from "./auth.controller.js";
import RegisterDTO from "./dto/register.dto.js";
import { authenticate } from "./auth.middleware.js";
import LoginDTO from "./dto/login.dto.js";

const router = Router();

router.post("/register", validate(RegisterDTO), controller.register);
router.post("/login", validate(LoginDTO), controller.login);
router.get("/me", authenticate, controller.login);
router.get("/logout", authenticate, controller.logout);

export default router;
