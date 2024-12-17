import express from "express";
import { adminLogin, usersData, adminLogout, usersAll, userUnique } from "../controllers/adminController.js";

const router = express.Router();


router.post('/logout',adminLogout);
router.post('/login', adminLogin);
router.get('/userData',usersData);
router.get('/usersAll' , usersAll);
router.post('/userUnique' , userUnique);
export default router;