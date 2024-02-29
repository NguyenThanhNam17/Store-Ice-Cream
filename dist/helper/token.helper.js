"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenHelper = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var secretKey = process.env.SECRET_KEY;
var TokenHelper = /** @class */ (function () {
    function TokenHelper() {
    }
    TokenHelper.generateToken = function (payload) {
        return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: "365d" });
        // return jwt.sign(payload, configs.secretKey);
    };
    TokenHelper.decodeToken = function (token) {
        return jsonwebtoken_1.default.verify(token, secretKey);
    };
    TokenHelper.generateKey = function () {
        var length = 7;
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    return TokenHelper;
}());
exports.TokenHelper = TokenHelper;
//# sourceMappingURL=token.helper.js.map