import express  from "express";
import { registerUser, verifyUser, loginUser, myProfile,   } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const  router = express.Router();

router.post("/user/register", registerUser);
router.post('/user/verify', verifyUser);
router.post('/user/login', loginUser);
router.get("/user/me",isAuth , myProfile);



export default router;    

