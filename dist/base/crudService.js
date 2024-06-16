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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
var baseService_1 = require("./baseService");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var lodash_1 = __importDefault(require("lodash"));
var error_1 = require("./error");
var CrudService = /** @class */ (function (_super) {
    __extends(CrudService, _super);
    function CrudService(model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        return _this;
    }
    CrudService.prototype.fetch = function (queryInput, populates) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, skip, order, search, timestamp, timeSort, query, q, time, textSearchIndex, or_1, query_1, filter, query4Count, countQuery, _i, populates_1, populate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryInput = __assign({}, queryInput);
                        limit = queryInput.limit || 10;
                        skip = queryInput.offset || (queryInput.page - 1) * limit || 0;
                        order = queryInput.order;
                        search = queryInput.search;
                        timestamp = queryInput.timestamp;
                        timeSort = queryInput.timeSort || -1;
                        query = this.model.find();
                        if (limit > 40) {
                            limit = 40;
                        }
                        q = [];
                        if (timestamp) {
                            time = (0, moment_timezone_1.default)(timestamp).subtract(7, "hours").toDate();
                            if (timeSort == -1) {
                                // Bài viết cũ hơn
                                q.push({ $lte: time });
                            }
                            else if (timeSort == 1) {
                                //Bài viết mới hơn
                                q.push({ $gte: time });
                            }
                        }
                        if (search) {
                            if (search.includes(" ")) {
                                lodash_1.default.set(queryInput, "filter.$text.$search", search);
                                query.select({ _score: { $meta: "textScore" } });
                                query.sort({ _score: { $meta: "textScore" } });
                            }
                            else {
                                textSearchIndex = this.model.schema
                                    .indexes()
                                    .find(function (c) { return lodash_1.default.values(c[0]).some(function (d) { return d == "text"; }); });
                                if (textSearchIndex) {
                                    or_1 = [];
                                    Object.keys(textSearchIndex[0]).forEach(function (key) {
                                        var _a;
                                        or_1.push((_a = {}, _a[key] = { $regex: search, $options: "i" }, _a));
                                    });
                                    if (lodash_1.default.get(queryInput, "filter.$or")) {
                                        query_1 = lodash_1.default.get(queryInput, "filter.$or");
                                        lodash_1.default.set(queryInput, "filter.$and", [{ $or: query_1 }, { $or: or_1 }]);
                                    }
                                    else {
                                        lodash_1.default.set(queryInput, "filter.$or", or_1);
                                    }
                                }
                            }
                        }
                        if (queryInput.filter) {
                            filter = JSON.parse(JSON.stringify(queryInput.filter).replace(/\"(\_\_)(\w+)\"\:/g, "\"$$$2\":"));
                            if (q[0]) {
                                filter.updatedAt = q[0];
                            }
                            query.setQuery(__assign({}, filter));
                        }
                        else {
                            if (q[0]) {
                                query.setQuery(q[0]);
                            }
                        }
                        if (order) {
                            query.sort(order);
                        }
                        query4Count = __assign({}, query === null || query === void 0 ? void 0 : query.getQuery());
                        delete query4Count.location;
                        countQuery = this.model.find();
                        countQuery.setQuery(query4Count);
                        query.limit(limit);
                        query.skip(skip);
                        if (populates && populates.length != 0) {
                            for (_i = 0, populates_1 = populates; _i < populates_1.length; _i++) {
                                populate = populates_1[_i];
                                query.populate(populate);
                            }
                        }
                        return [4 /*yield*/, Promise.all([query.exec(), countQuery.count()]).then(function (res) {
                                return {
                                    data: res[0],
                                    total: res[1],
                                    pagination: {
                                        page: queryInput.page || 1,
                                        limit: limit,
                                        offset: skip,
                                        total: res[1],
                                    },
                                };
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CrudService.prototype.findOne = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.findOne(filter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CrudService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.create(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CrudService.prototype.updateOne = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.updateOne({ _id: id }, data, {
                            runValidators: true,
                            context: "query",
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.model.findOne({ _id: id })];
                    case 2:
                        record = _a.sent();
                        if (!record)
                            throw error_1.ErrorHelper.recoredNotFound("Không tìm thấy dữ liệu");
                        return [2 /*return*/, record];
                }
            });
        });
    };
    return CrudService;
}(baseService_1.BaseService));
exports.CrudService = CrudService;
//# sourceMappingURL=crudService.js.map