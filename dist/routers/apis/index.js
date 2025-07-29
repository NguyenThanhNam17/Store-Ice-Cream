"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_route_1 = __importDefault(require("../apis/user.route"));
var product_route_1 = __importDefault(require("../apis/product.route"));
var cart_route_1 = __importDefault(require("../apis/cart.route"));
var order_route_1 = __importDefault(require("../apis/order.route"));
var wallet_route_1 = __importDefault(require("../apis/wallet.route"));
var router = express_1.default.Router();
router.use("/user", user_route_1.default);
router.use("/product", product_route_1.default);
router.use("/cart", cart_route_1.default);
router.use("/order", order_route_1.default);
router.use("/wallet", wallet_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map