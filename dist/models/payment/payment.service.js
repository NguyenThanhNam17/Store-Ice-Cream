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
exports.paymentService = void 0;
var crudService_1 = require("../../base/crudService");
var payment_model_1 = require("./payment.model");
var PaymentService = /** @class */ (function (_super) {
    __extends(PaymentService, _super);
    function PaymentService() {
        return _super.call(this, payment_model_1.PaymentModel) || this;
    }
    return PaymentService;
}(crudService_1.CrudService));
var paymentService = new PaymentService();
exports.paymentService = paymentService;
//# sourceMappingURL=payment.service.js.map