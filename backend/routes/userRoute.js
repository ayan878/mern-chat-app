import Router from "express";
import { getOtherUsers, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

router.post("/register", register);
router.get("/login", login);
router.get("/logout", logout);
router.get("/",isAuthenticated,getOtherUsers);




export default router;
