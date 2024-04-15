import express from "express";
import userRoute from "./user.route";
import bookRoute from "./book.route";
import bookCategoryRoute from "./bookCategory.route";
const router = express.Router();

router.use("/user", userRoute);
router.use("/book", bookRoute);
router.use("/bookCategory", bookCategoryRoute);
export default router;
