import express from "express";
import {
  handleAdminLogin,
  handleAdminLogout,
  handleAddNewAdmin,
} from "../controllers/admin.auth.controller";
import { protectAdminRoute } from "../middleware/protectAdminRoute";

const router = express.Router();

router.post("/newadmin",handleAddNewAdmin);
router.post("/login" ,handleAdminLogin);

router.post("/logout", handleAdminLogout);

export default router;
