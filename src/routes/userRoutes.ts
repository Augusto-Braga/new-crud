import { Router } from "express";
import { createUser, listUsers } from "../controllers/userController";
import { validateEmail } from "../middleware/validateEmail";

const router = Router();

router.post("/users", validateEmail, createUser);
router.get("/users", listUsers);

export default router;
