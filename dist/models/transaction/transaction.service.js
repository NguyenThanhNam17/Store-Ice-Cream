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
exports.transactionService = void 0;
var crudService_1 = require("../../base/crudService");
var transaction_model_1 = require("./transaction.model");
var TransactionService = /** @class */ (function (_super) {
    __extends(TransactionService, _super);
    function TransactionService() {
        return _super.call(this, transaction_model_1.TransactionModel) || this;
    }
    return TransactionService;
}(crudService_1.CrudService));
var transactionService = new TransactionService();
exports.transactionService = transactionService;
//# sourceMappingURL=transaction.service.js.map