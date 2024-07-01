import { NextFunction } from "express";
import { UserModel } from "../../models/user/user.model";
import { BaseRoute } from "../../base/baseRoute";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import { ErrorHelper } from "../../base/error";
import { Request, Response } from "../../base/baseRoute";
import { BookModel } from "../../models/book/book.model";
import moment from "moment";
import _ from "lodash";
import { bookService } from "../../models/book/book.service";
import vntk from "vntk";
class BookRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post("/getAllBook", this.route(this.getAllBook));
    // this.router.post(
    //   "/getAllBookForAdmin",
    //   [this.authentication],
    //   this.route(this.getAllBookForAdmin)
    // );
    this.router.post("/getOneBook", this.route(this.getOneBook));
    this.router.post(
      "/createBook",
      [this.authentication],
      this.route(this.createBook)
    );
    this.router.post(
      "/updateBook",
      [this.authentication],
      this.route(this.updateBook)
    );
    this.router.post(
      "/deleteOneBook",
      [this.authentication],
      this.route(this.deleteOneBook)
    );
    this.router.post(
      "/setHightlightBook",
      [this.authentication],
      this.route(this.setHightlightBook)
    );
  }
  //Auth
  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.get("x-token")) {
        throw ErrorHelper.unauthorized();
      }
      const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
      if ([ROLES.ADMIN, ROLES.CLIENT, ROLES.STAFF].includes(tokenData.role_)) {
        const user: any = await UserModel.findById(tokenData._id);
        if (!user) {
          throw ErrorHelper.userNotExist();
        }
        req.tokenInfo = tokenData;
        next();
      } else {
        throw ErrorHelper.permissionDeny();
      }
    } catch {
      throw ErrorHelper.unauthorized();
    }
  }
  //getAllBook
  async getAllBook(req: Request, res: Response) {
    let tokenData: any;
    if (req.get("x-token")) {
      tokenData = TokenHelper.decodeToken(req.get("x-token"));
    }
    try {
      req.body.limit = parseInt(req.body.limit);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("limit");
    }
    try {
      req.body.page = parseInt(req.body.page);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("page");
    }
    var { limit, page, search, filter, order, fromDate, toDate } = req.body;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    if (search && tokenData) {
      if (tokenData.role_ != ROLES.ADMIN) {
        let mine = await UserModel.findById(tokenData._id);
        if (!mine) {
          throw ErrorHelper.userNotExist();
        }
        const keywords = mine.searchs.join("|");
        _.set(req.body, "filter", {
          content: { $regex: keywords, $options: "i" },
        });
        const text = search;
        const tokenizer = vntk.posTag();
        const words: any = tokenizer.tag(text);

        const nouns = words.filter(
          (word: any) => word[1] === "N" || word[1] === "M" || word[1] === "Np"
        );

        const tfidf = new vntk.TfIdf();
        tfidf.addDocument(text);
        const importantWords = nouns.map((word: any) => {
          return {
            word: word[0],
            tfidf: tfidf.tfidfs(word[0], function (i, measure) {
              console.log("document #" + i + " is " + measure);
            }),
          };
        });

        const topKeywords = importantWords
          .sort((a: any, b: any) => b.tfidf - a.tfidf)
          .slice(0, 3);
        const result = topKeywords.map((item: any) => item.word);

        await Promise.all([
          UserModel.updateOne(
            { _id: mine._id },
            {
              $addToSet: {
                searchs: {
                  $each: result,
                },
              },
            }
          ),
          //limit array size
          UserModel.updateOne(
            { _id: mine._id },
            {
              $push: {
                searchs: {
                  $each: [],
                  $slice: -10,
                },
              },
            }
          ),
        ]);
      }
    }
    if (fromDate && toDate) {
      fromDate = moment(fromDate).startOf("day").toDate();
      toDate = moment(toDate).endOf("day").toDate();
      _.set(req, "body.filter.createdAt", { $gte: fromDate, $lte: toDate });
    }

    const books = await bookService.fetch(
      {
        filter: req.body.filter,
        order: order,
        search: search,
        limit: limit,
        page: page,
      },
      ["category"]
    );
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: books,
    });
  }
  // async getAllBookForAdmin(req: Request, res: Response) {
  //   let tokenData: any;
  //   if (req.get("x-token")) {
  //     tokenData = TokenHelper.decodeToken(req.get("x-token"));
  //   }
  //   if (tokenData.role_ != ROLES.ADMIN) {
  //     throw ErrorHelper.permissionDeny();
  //   }
  //   try {
  //     req.body.limit = parseInt(req.body.limit);
  //   } catch (err) {
  //     throw ErrorHelper.requestDataInvalid("limit");
  //   }
  //   try {
  //     req.body.page = parseInt(req.body.page);
  //   } catch (err) {
  //     throw ErrorHelper.requestDataInvalid("page");
  //   }
  //   var { limit, page, search, filter } = req.body;
  //   if (!limit) {
  //     limit = 10;
  //   }
  //   if (!page) {
  //     page = 1;
  //   }
  //   const books = await bookService.fetch(
  //     {
  //       filter: filter,
  //       search: search,
  //       limit: limit,
  //       page: page,
  //     },
  //     ["category"]
  //   );
  //   return res.status(200).json({
  //     status: 200,
  //     code: "200",
  //     message: "success",
  //     data: books,
  //   });
  // }
  //getOneBook
  async getOneBook(req: Request, res: Response) {
    let { id } = req.body;
    const book: any = await BookModel.findById(id).populate("category");
    if (!book) {
      //throw lỗi không tìm thấy
      throw ErrorHelper.recoredNotFound("Book!");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async createBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { name, author, categoryId, description, price, quantity, images } =
      req.body;
    if (!name || !author || !categoryId || !description) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    const book = new BookModel({
      name: name,
      author: author,
      categoryId: categoryId,
      description: description,
      price: price,
      quantity: quantity,
      images: images,
    });
    await book.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async updateBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const {
      id,
      name,
      author,
      categoryId,
      description,
      price,
      quantity,
      images,
      note,
      isHighlight,
    } = req.body;

    let book = await BookModel.findById(id);
    if (!book) {
      throw ErrorHelper.recoredNotFound("Book");
    }
    book.name = name || book.name;
    book.author = author || book.author;
    book.categoryId = categoryId || book.categoryId;
    book.description = description || book.description;
    book.price = price || book.price;
    book.quantity = quantity || book.quantity;
    book.images = images || book.images;
    if (isHighlight != null) {
      book.isHighlight = isHighlight;
    }
    await book.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async deleteOneBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id } = req.body;

    let book = await BookModel.findById(id);
    if (!book) {
      throw ErrorHelper.recoredNotFound("Book!");
    }
    await BookModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async setHightlightBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id, isHighlight } = req.body;
    let book = await BookModel.findById(id);
    if (!book) {
      throw ErrorHelper.recoredNotFound("Book!");
    }
    await bookService.updateOne(book._id, {
      $set: {
        isHighlight: isHighlight,
      },
    });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
}
export default new BookRoute().router;
