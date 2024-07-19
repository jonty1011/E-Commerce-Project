import express from "express";
import {isAuth} from "../middlewares/isAuth.js";
import { 
     createProduct ,
     deleteProduct,
     fetchProducts,
     fetchSingleProduct,
     updateStock,
     } from "../controllers/product.js";
import { uploadFiles } from "../middlewares/multan.js";


const router = express.Router();

router.post("/product/new", isAuth,uploadFiles, createProduct);
router.get("/product/all", fetchProducts);
router.get("/product/:id", fetchSingleProduct);
router.put("/product/:id", isAuth , updateStock);
router.delete("/product/:id", isAuth ,deleteProduct)

export default router;