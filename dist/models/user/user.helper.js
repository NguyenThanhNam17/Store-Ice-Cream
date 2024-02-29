"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHelper = void 0;
var token_helper_1 = require("../../helper/token.helper");
var UserHelper = /** @class */ (function () {
    function UserHelper(user) {
        this.user = user;
    }
    UserHelper.prototype.value = function () {
        return this.user;
    };
    UserHelper.prototype.getToken = function (key) {
        return token_helper_1.TokenHelper.generateToken({
            role_: this.user.role,
            _id: this.user._id,
            key: key !== null && key !== void 0 ? key : "",
            username: this.user.name || this.user.phone || this.user.role,
        });
    };
    return UserHelper;
}());
exports.UserHelper = UserHelper;
//# sourceMappingURL=user.helper.js.map