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
var user_model_1 = require("../../models/user/user.model");
var baseRoute_1 = require("../../base/baseRoute");
var token_helper_1 = require("../../helper/token.helper");
var role_const_1 = require("../../constants/role.const");
var error_1 = require("../../base/error");
var book_model_1 = require("../../models/book/book.model");
var lodash_1 = __importDefault(require("lodash"));
var book_service_1 = require("../../models/book/book.service");
var vntk_1 = __importDefault(require("vntk"));
var BookRoute = /** @class */ (function (_super) {
    __extends(BookRoute, _super);
    function BookRoute() {
        return _super.call(this) || this;
    }
    BookRoute.prototype.customRouting = function () {
        this.router.post("/getAllBook", this.route(this.getAllBook));
        this.router.get("/getOneBook/:id", this.route(this.getOneBook));
        this.router.post("/createBook", [this.authentication], this.route(this.createBook));
        this.router.post("/updateBook", [this.authentication], this.route(this.updateBook));
        this.router.post("/deleteOneBook", [this.authentication], this.route(this.deleteOneBook));
        this.router.post("/setHightlightBook", [this.authentication], this.route(this.setHightlightBook));
    };
    //Auth
    BookRoute.prototype.authentication = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.get("x-token")) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.CLIENT, role_const_1.ROLES.STAFF].includes(tokenData.role_)) return [3 /*break*/, 2];
                        return [4 /*yield*/, user_model_1.UserModel.findById(tokenData._id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw error_1.ErrorHelper.userNotExist();
                        }
                        req.tokenInfo = tokenData;
                        next();
                        return [3 /*break*/, 3];
                    case 2: throw error_1.ErrorHelper.permissionDeny();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //getAllBook
    BookRoute.prototype.getAllBook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, a, _a, limit, page, search, filter, mine, keywords, text, tokenizer, words, nouns, tfidf_1, importantWords, topKeywords, result, books;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        return [4 /*yield*/, book_model_1.BookModel.find({})];
                    case 1:
                        a = _b.sent();
                        a.map(function (item) {
                            book_service_1.bookService.updateOne(item._id, {
                                $set: {
                                    isHighlight: false,
                                    soldQuantity: 10,
                                },
                            });
                        });
                        try {
                            req.body.limit = parseInt(req.body.limit);
                        }
                        catch (err) {
                            throw error_1.ErrorHelper.requestDataInvalid("limit");
                        }
                        try {
                            req.body.page = parseInt(req.body.page);
                        }
                        catch (err) {
                            throw error_1.ErrorHelper.requestDataInvalid("page");
                        }
                        _a = req.body, limit = _a.limit, page = _a.page, search = _a.search, filter = _a.filter;
                        if (!limit) {
                            limit = 10;
                        }
                        if (!page) {
                            page = 1;
                        }
                        if (!(search && tokenData)) return [3 /*break*/, 4];
                        return [4 /*yield*/, user_model_1.UserModel.findById(tokenData._id)];
                    case 2:
                        mine = _b.sent();
                        if (!mine) {
                            throw error_1.ErrorHelper.userNotExist();
                        }
                        console.log(mine);
                        keywords = mine.searchs.join("|");
                        lodash_1.default.set(req.body, "filter", {
                            content: { $regex: keywords, $options: "i" },
                        });
                        text = search;
                        tokenizer = vntk_1.default.posTag();
                        words = tokenizer.tag(text);
                        nouns = words.filter(function (word) { return word[1] === "N" || word[1] === "M" || word[1] === "Np"; });
                        tfidf_1 = new vntk_1.default.TfIdf();
                        tfidf_1.addDocument(text);
                        importantWords = nouns.map(function (word) {
                            return {
                                word: word[0],
                                tfidf: tfidf_1.tfidfs(word[0], function (i, measure) {
                                    console.log("document #" + i + " is " + measure);
                                }),
                            };
                        });
                        topKeywords = importantWords
                            .sort(function (a, b) { return b.tfidf - a.tfidf; })
                            .slice(0, 3);
                        result = topKeywords.map(function (item) { return item.word; });
                        return [4 /*yield*/, Promise.all([
                                user_model_1.UserModel.updateOne({ _id: mine._id }, {
                                    $addToSet: {
                                        searchs: {
                                            $each: result,
                                        },
                                    },
                                }),
                                //limit array size
                                user_model_1.UserModel.updateOne({ _id: mine._id }, {
                                    $push: {
                                        searchs: {
                                            $each: [],
                                            $slice: -10,
                                        },
                                    },
                                }),
                            ])];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [4 /*yield*/, book_service_1.bookService.fetch({
                            filter: filter,
                            search: search,
                            limit: limit,
                            page: page,
                        }, ["category"])];
                    case 5:
                        books = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: books,
                            })];
                }
            });
        });
    };
    //getOneBook
    BookRoute.prototype.getOneBook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, book;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, book_model_1.BookModel.findById(id).populate("category")];
                    case 1:
                        book = _a.sent();
                        if (!book) {
                            //throw lỗi không tìm thấy
                            throw error_1.ErrorHelper.recoredNotFound("Book!");
                        }
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    book: book,
                                },
                            })];
                }
            });
        });
    };
    BookRoute.prototype.createBook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, author, categoryId, description, price, quantity, images, book;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (role_const_1.ROLES.ADMIN != req.tokenInfo.role_) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        _a = req.body, name = _a.name, author = _a.author, categoryId = _a.categoryId, description = _a.description, price = _a.price, quantity = _a.quantity, images = _a.images;
                        if (!name || !author || !categoryId || !description) {
                            throw error_1.ErrorHelper.requestDataInvalid("Invalid data!");
                        }
                        book = new book_model_1.BookModel({
                            name: name,
                            author: author,
                            categoryId: categoryId,
                            description: description,
                            price: price,
                            quantity: quantity,
                            images: images,
                        });
                        return [4 /*yield*/, book.save()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    book: book,
                                },
                            })];
                }
            });
        });
    };
    BookRoute.prototype.updateBook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, name, author, categoryId, description, price, quantity, images, book;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (role_const_1.ROLES.ADMIN != req.tokenInfo.role_) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        _a = req.body, id = _a.id, name = _a.name, author = _a.author, categoryId = _a.categoryId, description = _a.description, price = _a.price, quantity = _a.quantity, images = _a.images;
                        return [4 /*yield*/, book_model_1.BookModel.findById(id)];
                    case 1:
                        book = _b.sent();
                        if (!book) {
                            throw error_1.ErrorHelper.recoredNotFound("Book");
                        }
                        book.name = name;
                        book.author = author;
                        book.categoryId = categoryId;
                        book.description = description;
                        book.price = price;
                        book.quantity = quantity;
                        book.images = images;
                        return [4 /*yield*/, book.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    book: book,
                                },
                            })];
                }
            });
        });
    };
    BookRoute.prototype.deleteOneBook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, book;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (role_const_1.ROLES.ADMIN != req.tokenInfo.role_) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        id = req.body.id;
                        return [4 /*yield*/, book_model_1.BookModel.findById(id)];
                    case 1:
                        book = _a.sent();
                        if (!book) {
                            throw error_1.ErrorHelper.recoredNotFound("Book!");
                        }
                        return [4 /*yield*/, book_model_1.BookModel.deleteOne({ _id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    book: book,
                                },
                            })];
                }
            });
        });
    };
    BookRoute.prototype.setHightlightBook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, isHighlight, book;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (role_const_1.ROLES.ADMIN != req.tokenInfo.role_) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        _a = req.body, id = _a.id, isHighlight = _a.isHighlight;
                        return [4 /*yield*/, book_model_1.BookModel.findById(id)];
                    case 1:
                        book = _b.sent();
                        if (!book) {
                            throw error_1.ErrorHelper.recoredNotFound("Book!");
                        }
                        return [4 /*yield*/, book_service_1.bookService.updateOne(book._id, {
                                $set: {
                                    isHighlight: isHighlight,
                                },
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    book: book,
                                },
                            })];
                }
            });
        });
    };
    return BookRoute;
}(baseRoute_1.BaseRoute));
exports.default = new BookRoute().router;
//# sourceMappingURL=book.route.js.map