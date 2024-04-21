"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusEnum = exports.UserRoleEnum = void 0;
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
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
//# sourceMappingURL=model.const.js.map