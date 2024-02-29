"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resError = void 0;
function resError(res, error) {
    if (!error.info) {
        res.status(500).json({
            status: 500,
            code: "500",
            message: "Có lỗi xảy ra!",
        });
        logUnknowError(error);
    }
    else {
        res.status(error.info.status).json(error.info);
    }
}
exports.resError = resError;
function logUnknowError(error) {
    console.log("*** UNKNOW ERROR ***");
    console.log(error);
    console.log("********************");
}
//# sourceMappingURL=resError.js.map