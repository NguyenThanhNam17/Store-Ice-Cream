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
import slug from "slug";
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

    this.router.post("/deleteProduct",[this.route(this.authentication)],this.route(this.deleteProduct));
    this.router.post("/updateProduct",[this.route(this.authentication)],this.route(this.updateProduct));
    this.router.post("/getOneProductBySlug",[this.route(this.authentication)],this.route(this.getOneProductBySlug));
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
    let {name, price,image}= req.body;
   
    if(!name||!price||!image){
      throw ErrorHelper.requestDataInvalid("invalid");
    }

    let product = await ProductModel.findOne({name:name});
    if(product){
      throw ErrorHelper.forbidden("Sản phẩm đã tồn tại!");
    }

    let pro = new ProductModel({
      name: name,
      slug: slug(name),
      price:price,
      image:image,
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

async deleteProduct(req:Request,res:Response,next:NextFunction){
  console.log(req.tokenInfo);
  let {id} = req.body;
  let prod = await ProductModel.findById(id);
  if(!prod){
    throw ErrorHelper.forbidden("not product!!");
  }
  await ProductModel.deleteOne({ _id: id });
  return res.status(200).json({
    status:200,
    code:"200",
    message:"succes",
    data:{
      prod
    }
  })
}

async updateProduct(req:Request,res:Response,next:NextFunction){
  let {id,name,price,image,describe} = req.body;
  let product = await ProductModel.findById(id);
  if(!product){
    throw ErrorHelper.forbidden("not product!!");
  }
  product.name = name||product.name;
   product.price = price||product.price;
    product.image = image||product.image;
     product.describe = describe||product.describe;
     await product.save();
     return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        product
      }
     })
}

async getOneProductBySlug(req:Request,res:Response){
  let {slug} = req.body;
  let prod = (await ProductModel.findOne({slug:slug}));
  if(!prod){
    throw ErrorHelper.forbidden("not product!!");
  }
  return res.status(200).json({
    status:200,
    code:"200",
    message:"succes",
    data:{
      prod,
    }
  })
}

}

export default new ProductRoute().router;


