"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatusEnum = exports.ShoppingCartStatusEnum = exports.paymentMethodEnum = exports.OrderStatusEnum = exports.UserRoleEnum = void 0;
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "ADMIN";
    UserRoleEnum["CLIENT"] = "CLIENT";
    // STAFF = "STAFF",
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["UNPAID"] = "UNPAID";
    OrderStatusEnum["PENDING"] = "PENDING";
    OrderStatusEnum["PROCESSING"] = "PROCESSING";
    OrderStatusEnum["DELIVERING"] = "DELIVERING";
    OrderStatusEnum["SUCCESS"] = "SUCCESS";
    OrderStatusEnum["CANCEL"] = "CANCEL";
    //IN_CART = "IN_CART",
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
var paymentMethodEnum;
(function (paymentMethodEnum) {
    paymentMethodEnum["CASH"] = "CASH";
    paymentMethodEnum["ATM"] = "ATM";
    paymentMethodEnum["WALLET"] = "WALLET";
})(paymentMethodEnum || (exports.paymentMethodEnum = paymentMethodEnum = {}));
var ShoppingCartStatusEnum;
(function (ShoppingCartStatusEnum) {
    ShoppingCartStatusEnum["IN_CART"] = "IN_CART";
    ShoppingCartStatusEnum["SUCCESS"] = "SUCCESS";
})(ShoppingCartStatusEnum || (exports.ShoppingCartStatusEnum = ShoppingCartStatusEnum = {}));
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["PENDING"] = "PENDING";
    PaymentStatusEnum["SUCCESS"] = "SUCCESS";
    PaymentStatusEnum["FAIL"] = "FAIL";
})(PaymentStatusEnum || (exports.PaymentStatusEnum = PaymentStatusEnum = {}));
//# sourceMappingURL=model.const.js.map