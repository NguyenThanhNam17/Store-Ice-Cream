"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.paymentMethodEnum = exports.OrderStatusEnum = exports.UserRoleEnum = void 0;
=======
exports.OrderStatusEnum = exports.UserRoleEnum = void 0;
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "ADMIN";
    UserRoleEnum["CLIENT"] = "CLIENT";
    UserRoleEnum["STAFF"] = "STAFF";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["PENDING"] = "PENDING";
    OrderStatusEnum["PROCESSING"] = "PROCESSING";
    OrderStatusEnum["DELIVERING"] = "DELIVERING";
    OrderStatusEnum["SUCCESS"] = "SUCCESS";
    OrderStatusEnum["CANCEL"] = "CANCEL";
<<<<<<< HEAD
    OrderStatusEnum["IN_CART"] = "IN_CART";
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
var paymentMethodEnum;
(function (paymentMethodEnum) {
    paymentMethodEnum["CASH"] = "CASH";
    paymentMethodEnum["BANK_TRANSFER"] = "BANK_TRANSFER";
    paymentMethodEnum["WALLET"] = "WALLET";
})(paymentMethodEnum || (exports.paymentMethodEnum = paymentMethodEnum = {}));
=======
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6
//# sourceMappingURL=model.const.js.map