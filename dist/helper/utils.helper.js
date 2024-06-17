"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsHelper = void 0;
var UtilsHelper = /** @class */ (function () {
    function UtilsHelper() {
    }
    UtilsHelper.parsePhone = function (phone, pre) {
        if (!phone)
            return phone;
        var newPhone = "" + phone;
        newPhone = newPhone
            .replace(/^\+84/i, pre)
            .replace(/^\+0/i, pre)
            .replace(/^0/i, pre)
            .replace(/^84/i, pre);
        return newPhone;
    };
    return UtilsHelper;
}());
exports.UtilsHelper = UtilsHelper;
//# sourceMappingURL=utils.helper.js.map