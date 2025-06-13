import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { CartModel } from "../../models/cart/cart.model";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import { UserModel } from "../../models/user/user.model";
import { ProductModel } from "../../models/product/product.model";
import { CartStatusEnum } from "../../constants/model.const";

class CartRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get(
      "/getAllCart",
      [this.authentication],
      this.route(this.getAllCart)
    );

    this.router.post(
      "/addCartProductToCart",
      [this.authentication],
      this.route(this.addCartProductToCart)
    );

        this.router.post(
      "/deleteCartProductToCart",
      [this.authentication],
      this.route(this.deleteCartProductToCart)
    );

           this.router.post(
      "/updateCartProductToCart",
      [this.authentication],
      this.route(this.updateCartProductToCart)
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

  async getAllCart(req: Request, res: Response) {
    let carts = await CartModel.find({
      userId: req.tokenInfo._id,
      status: CartStatusEnum.PENDING,
    });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        carts,
      },
    });
  }

  async addCartProductToCart(req: Request, res: Response) {
    let { productId, quantity } = req.body;
    if (!productId || !quantity) {
      throw ErrorHelper.requestDataInvalid("product");
    }
    let checkProduct = await ProductModel.findById(productId);
    if (!checkProduct) {
      throw ErrorHelper.requestDataInvalid("product");
    }

    let cart = new CartModel({
      productId: productId,
      userId: req.tokenInfo._id,
      quantity: quantity,
    });

    await cart.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        cart,
      },
    });
  }

async deleteCartProductToCart(req:Request,res:Response,next:NextFunction){
  let {id} = req.body;
  let cart = await CartModel.findById(id);
  if(!cart){
    throw ErrorHelper.recoredNotFound("cart");
  }
  await CartModel.deleteOne({_id:id});
  return res.status(200).json({
    status:200,
    code:"200",
    message:"succes",
    data:{
      cart
    }
  })
}

async updateCartProductToCart(req:Request,res:Response,next:NextFunction){
  let {id, quantity, productId} = req.body;

  if(!id||!quantity||!productId){
    throw ErrorHelper.requestDataInvalid("invalid");
  }

  const cart = await CartModel.findById(id);

  if(!cart){
    throw ErrorHelper.recoredNotFound("cart");
  }

  cart.productId = productId||cart.productId;
    cart.quantity = quantity||cart.quantity;
    await cart.save();
    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        cart
      }
    })
}
  
}

export default new CartRoute().router;
