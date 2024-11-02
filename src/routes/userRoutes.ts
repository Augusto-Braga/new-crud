import { Router } from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../controllers/userController";
import { validateEmail } from "../middleware/validateEmail";

const router = Router();

router.post("/users", validateEmail, createUser);
router.get("/users", listUsers);
router.delete("/users", deleteUser);
router.put("/users", validateEmail, updateUser);

export default router;
