import express from "express";
import userRoute from "../apis/user.route";
import productRoute from "../apis/product.route";
import cartRoute from "../apis/cart.route";
import orderRoute from "../apis/order.route";
import walletRoute from "../apis/wallet.route";
const router = express.Router();

router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/wallet", walletRoute);
export default router;
