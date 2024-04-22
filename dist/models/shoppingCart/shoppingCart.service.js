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
exports.shoppingCartService = void 0;
var crudService_1 = require("../../base/crudService");
var shoppingCart_model_1 = require("./shoppingCart.model");
var ShoppingCartService = /** @class */ (function (_super) {
    __extends(ShoppingCartService, _super);
    function ShoppingCartService() {
        return _super.call(this, shoppingCart_model_1.ShoppingCartModel) || this;
    }
    return ShoppingCartService;
}(crudService_1.CrudService));
var shoppingCartService = new ShoppingCartService();
exports.shoppingCartService = shoppingCartService;
//# sourceMappingURL=shoppingCart.service.js.map