import { response } from "express";
import sendMail from "../middlewares/sendMail.js";
import {Cart} from "../models/cart.js";
import {Order} from "../models/Order.js";
import {Product} from "../models/Product.js"

export const newOrderCod = async (req, res) => {
    try {
      const { method, phone, address } = req.body;
  
      const cart = await Cart.find({ user: req.user._id }).populate("product");
  
      let subTotal = 0;
  
      cart.forEach((i) => {
        const itemSubtotal = i.product.price * i.quantity;
  
        subTotal += itemSubtotal;
      });
  
      const items = await Cart.find({ user: req.user._id })
        .select("-_id")
        .select("-user")
        .select("-__v");
  
      const order = await Order.create({
        items,
        method,
        user: req.user._id,
        phone,
        address,
        subTotal,
      });
  
      for (let i of order.items) {
        let product = await Product.findOne({ _id: i.product });
  
        product.$inc("stock", -1 * i.quantity);
        product.$inc("sold", +i.quantity);
  
        await product.save();
      }
  
      await Cart.find({ user: req.user._id }).deleteMany();
  
      await sendMail(
        req.user.email,
        "Let's negotitate",
        `Thanks your shopping of ₹ ${subTotal} from our Platform your order will be deliverd soon`
      );
  
      res.status(201).json({
        message: "Order Placed Successfully",
        order,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  export const getMyOrder = async (req,res)=>{
    try{
         const order = await Order.findById(req.params.id)
         res.json({order});
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
  };

 
    export const updateStatus = async(req,res)=>{
        try{
            if(req.user.role !== "admin"){
                return res.status(403).json({
                    message: "This is admin route",
                });
            }

            const order = await Order.findByIdAndUpdate(req.params.id);

            if(order.status === "Pending"){
                order.status = "Processing";

         await sendMail(
            req.user.email,
            "Lets negotiate",
            "Your order is in processing and it will be delivered soon"
         );

         await order.save();

         return res.json({
             message: "order status updated",
         });
            }
                if(order.status === "Processing"){
                    order.status = "Shipped";

                    await sendMail(
                        req.user.email,
                        "Lets negotiate",
                        "Your order is in processing and it will be delivered soon"
                    );

                    await order.save();
                
                    return res.json({
                        message: "order status updated",
                    });
                }

                if(order.status === "Shippped"){
                    order.status = "Out of delivery";

                    await sendMail(
                        req.user.email,
                        "Lets negotiate",
                        "Your order is out of delivery and it will delivery soon"
                    );

                    await order.save();

                    return res.json({
                        message:"order status updated",
                    });
                }

                if(order.status === "Out of delivery"){
                    order.status = "Delivered";

                    await sendMail(
                        req.user.email,
                        "Letw negotiate",
                        "Your order is Delivered Thank you for shoppning"
                    );
                    await order.save();

                    return res.json({
                        message:'Order status updated',
                    });
                }

        }catch(error){
            res.status(500).json({
                message: error.message,
            });
        }
    };