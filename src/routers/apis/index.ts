import express from "express";
import userRoute from "./user.route";
import bookRoute from "./book.route";
import bookCategoryRoute from "./bookCategory.route";
import orderRoute from "./order.route";
import shoppingCartRoute from "./shoppingCart.route";
const router = express.Router();

router.use("/user", userRoute);
router.use("/book", bookRoute);
router.use("/bookCategory", bookCategoryRoute);
router.use("/order", orderRoute);
router.use("/shoppingCart", shoppingCartRoute);
export default router;
