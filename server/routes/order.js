import express from 'express'
import {isAuth} from "../middlewares/isAuth.js";
import { getMyOrder, newOrderCod, updateStatus } from '../controllers/order.js';

const router = express.Router();

router.post("/order/new/cod", isAuth, newOrderCod);
router.get("/order/:id", isAuth,getMyOrder);
router.put("/order/:id", isAuth, updateStatus);

export default router;