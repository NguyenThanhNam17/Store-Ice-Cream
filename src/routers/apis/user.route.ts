import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { model } from "mongoose";
import { UserModel } from "../../models/user/user.model";
import passwordHash from "password-hash";
import { ROLES } from "../../constants/role.const";
import { UserHelper } from "../../models/user/user.helper";
import { TokenHelper } from "../../helper/token.helper";
import { UserRoleEnum } from "../../constants/model.const";
import phone from "phone/dist";

class UserRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.post("/login", this.route(this.login));
    this.router.post("/register", this.route(this.register));
    this.router.get("/getMe", [this.authentication], this.route(this.getMe));
    this.router.get("/getOneUser", [this.authentication], this.route(this.getOneUser));
       this.router.get("/getAllUser", [this.authentication], this.route(this.getAllUser));
        this.router.post("/createUser", [this.authentication], this.route(this.createUser));
         this.router.post("/updateMe", [this.authentication], this.route(this.updateMe));
         this.router.get("/deleteOneUser", [this.authentication], this.route(this.deleteOneUser));
       
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
  

  async login(req: Request, res: Response) {
    let { username, password } = req.body;

    if (!username || !password) {
      throw ErrorHelper.requestDataInvalid("request data");
    }
    let user = await UserModel.findOne({
      $or: [{ phone: username }, { email: username }],
    });
    if (!user) {
      throw ErrorHelper.userNotExist();
    }

    let check = passwordHash.verify(password, user.password);
    if (!check) {
      throw ErrorHelper.userPasswordNotCorrect();
    }
    const key = TokenHelper.generateKey();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        user,
        token: new UserHelper(user).getToken(key),
      },
    });
  }

  async register(req: Request, res: Response) {
    let { name, phoneNumber, password } = req.body;
    let user = await UserModel.findOne({
      phone:phoneNumber
    });
    if (user) {
      throw ErrorHelper.userExisted();
    }

    if (!phoneNumber || !password) {
      throw ErrorHelper.requestDataInvalid("request data");
    }
    const key = TokenHelper.generateKey();
    user = new UserModel({
      name:name,
      phone: phoneNumber,
      password: passwordHash.generate(password),
      role: ROLES.CLIENT,
      key: key,
    });
    await user.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        user,
        token: new UserHelper(user).getToken(key),
      },
    });
  }


  async getMe(req:Request,res:Response){
    const user:any = await UserModel.findById(req.tokenInfo._id);
    if(!user){
      throw ErrorHelper.userNotExist();
    }

    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        user,
      }
    })
  }

  async getOneUser(req:Request,res:Response,next:NextFunction){
    let {id} = req.body;
    let user = await UserModel.findById(id);
    if(!user){
      throw ErrorHelper.userNotExist();
    }
    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        user
      }
    })
  }

  async getAllUser(req:Request,res:Response,next:NextFunction){
    let user = await UserModel.find();
    if(!user){
      throw ErrorHelper.userNotExist();
    }
    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        user,
      }
    })
  }

  async createUser(req:Request,res:Response,next:NextFunction){
    if(UserRoleEnum.ADMIN!=req.tokenInfo.role_){
      throw ErrorHelper.permissionDeny();
    }
    let {name,phoneNumber,password,role} = req.body;
    if(!name||!phoneNumber||!password){
      throw ErrorHelper.requestDataInvalid("invalid");
    }
    
    let phoneNew = await UserModel.findOne({phone:phoneNumber});
    if(phoneNew){
      throw ErrorHelper.userExisted();
    }

     const key = TokenHelper.generateKey();
    let user = new UserModel({
      name:name,
      phone:phoneNumber,
      password:password,
      key:key,
      role:role,
    })

    await user.save();
    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        user
      }
    })
  }

  async updateMe(req:Request,res:Response,next:NextFunction){
    let user = await UserModel.findById(req.tokenInfo._id);
    if(!user){
      throw ErrorHelper.userNotExist();
    }

    let {newName,newPhoneNumber} = req.body;
    user.name = newName;
    user.phone=newPhoneNumber;
    await user.save();
    return res.status(200).json({
      status:200,
      code:"200",
      message:"succes",
      data:{
        user
      }
    })
  }

  async deleteOneUser(req:Request, res:Response, next:NextFunction){
    if(req.tokenInfo.role_!=ROLES.ADMIN){
      throw ErrorHelper.permissionDeny();
    }

    let {id} = req.body;

    let user = await UserModel.findById(id);

    if(!user){
      throw ErrorHelper.userNotExist();
    }

    await UserModel.deleteOne({_id:id});
    return res.status(200).json({
      status:200,
      code:"200",
      messagee:"succes",
      data:{
        user
      }
    })
  }

}

export default new UserRoute().router;
