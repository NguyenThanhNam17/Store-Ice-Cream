import express from "express";
import userRoute from "./user.route";
import bookRoute from "./book.route";
const router = express.Router();

router.use("/user", userRoute);
router.use("/book", bookRoute);
export default router;
