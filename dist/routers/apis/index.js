"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_route_1 = __importDefault(require("./user.route"));
var book_route_1 = __importDefault(require("./book.route"));
var bookCategory_route_1 = __importDefault(require("./bookCategory.route"));
var order_route_1 = __importDefault(require("./order.route"));
var router = express_1.default.Router();
router.use("/user", user_route_1.default);
router.use("/book", book_route_1.default);
router.use("/bookCategory", bookCategory_route_1.default);
router.use("/order", order_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map