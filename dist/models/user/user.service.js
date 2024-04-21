"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
var crudService_1 = require("../../base/crudService");
var user_model_1 = require("./user.model");
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService() {
        return _super.call(this, user_model_1.UserModel) || this;
    }
    return UserService;
}(crudService_1.CrudService));
var userService = new UserService();
exports.userService = userService;
//# sourceMappingURL=user.service.js.map