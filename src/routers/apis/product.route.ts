import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ProductModel } from "../../models/product/product.model";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import { UserModel } from "../../models/user/user.model";

class ProductRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/getAllProduct", this.route(this.getAllProduct));
    this.router.get(
      "/getOneProduct/:idProduct",
      this.route(this.getOneProduct)
    );

     this.router.post(
      "/addProductForAdmin",
       [this.route(this.authentication)],
      this.route(this.addProductForAdmin)
    );
  }

  async authentication(req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.get("x-token")) {
          throw ErrorHelper.unauthorized();
        }
        const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
        if ([ROLES.ADMIN, ROLES.CLIENT].includes(tokenData.role_)) {
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

  async getAllProduct(req: Request, res: Response) {
    let products = await ProductModel.find({});
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        products,
      },
    });
  }

  async getOneProduct(req: Request, res: Response) {
    let { idProduct } = req.params;
    let product = await ProductModel.findById(idProduct);

    if (!product) {
      throw ErrorHelper.recoredNotFound("product");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        product,
      },
    });
  }

  async addProductForAdmin(req:Request,res:Response,next:NextFunction){
    let {name, price,image,describe}= req.body;
    if(!name||!price||!image||!describe){
      throw ErrorHelper.requestDataInvalid("invalid");
    }

    let product = await ProductModel.findOne({name:name});
    if(product){
      throw ErrorHelper.forbidden("Sản phẩm đã tồn tại!");
    }

    let pro = new ProductModel({
      name: name,
      price:price,
      image:image,
      describe:describe
    })

    await pro.save();
    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        pro
      }
    })
  }
}

export default new ProductRoute().router;
