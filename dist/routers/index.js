"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var apis_1 = __importDefault(require("./apis"));
var router = express_1.default.Router();
router.use("/api", apis_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map