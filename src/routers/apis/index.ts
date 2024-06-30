import express from "express";
import userRoute from "./user.route";
import bookRoute from "./book.route";
import bookCategoryRoute from "./bookCategory.route";
import orderRoute from "./order.route";
import shoppingCartRoute from "./shoppingCart.route";
import webhookRoute from "./webhook";
const router = express.Router();

router.use("/user", userRoute);
router.use("/book", bookRoute);
router.use("/bookCategory", bookCategoryRoute);
router.use("/order", orderRoute);
router.use("/shoppingCart", shoppingCartRoute);
router.use("/webhook", webhookRoute);
export default router;
