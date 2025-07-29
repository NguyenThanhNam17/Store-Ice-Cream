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
exports.walletService = void 0;
var crudService_1 = require("../../base/crudService");
var wallet_model_1 = require("./wallet.model");
var WalletService = /** @class */ (function (_super) {
    __extends(WalletService, _super);
    function WalletService() {
        return _super.call(this, wallet_model_1.WalletModel) || this;
    }
    return WalletService;
}(crudService_1.CrudService));
var walletService = new WalletService();
exports.walletService = walletService;
//# sourceMappingURL=wallet.service.js.map