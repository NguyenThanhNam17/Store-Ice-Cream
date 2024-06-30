import { InvoiceModel } from "../../models/invoice/invoice.model";
import { BaseRoute, Request, Response } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import * as CryptoJS from "crypto-js";
import { OrderModel } from "../../models/order/order.model";
import {
  OrderStatusEnum,
  PaymentStatusEnum,
} from "../../constants/model.const";
import { WalletModel } from "../../models/wallet/wallet.model";
import { walletService } from "../../models/wallet/wallet.service";
const axios = require("axios").default;

class WebhookRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.post("/9payment", this.route(this.ninePay));
    this.router.post("/sendData9Pay", this.route(this.sendData9Pay));
  }

  async ninePay(req: Request, res: Response) {
    const data = req.body;
    console.log(data);
    const checksum_key = process.env.CHECKSUM_KEY;
    const sha256Data = CryptoJS.SHA256(data.result.toString() + checksum_key);
    console.log(sha256Data.toString().toUpperCase());
    let buff = Buffer.from(data.result.toString(), "base64");
    let text = buff.toString("utf-8");
    const parseText = await JSON.parse(text);
    console.log("IPN:" + parseText);
    const invoice = await InvoiceModel.findOne({ _id: parseText.invoice_no });
    if (!invoice) {
      throw ErrorHelper.recoredNotFound("invoice!");
    }
    let order = await OrderModel.findById(invoice.orderId);
    if (!order) {
      if (!invoice) {
        throw ErrorHelper.recoredNotFound("order!");
      }
    }
    if (invoice.type == "PAYMENT") {
      if ([5, 16].includes(parseText.status)) {
        order.isPaid = true;
        order.status = OrderStatusEnum.PENDING;
        order.paymentStatus = PaymentStatusEnum.SUCCESS;
      } else if ([6, 8, 9].includes(parseText.status)) {
        order.paymentStatus = PaymentStatusEnum.FAIL;
      }
      await order.save();
    } else if (invoice.type == "DEPOSIT") {
      if ([5, 16].includes(parseText.status)) {
        let wallet = await WalletModel.findOne({ userId: invoice.userId });
        await walletService.updateOne(wallet._id, {
          $inc: {
            balance: invoice.amount,
          },
        });
      }
    }

    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      parseText,
    });
  }
  async sendData9Pay(req: Request, res: Response) {
    const data = req.body;
    const options = {
      method: "POST",
      baseURL: "https://api-book-store-voz2iwzoba-as.a.run.app",
      url: "/api/webhook/9payment",
      // headers: headers,
      data: {
        result: data.result,
        checksum: data.checksum,
      },
    };
    return await axios(options)
      .then(function (chunk: any) {
        return "success";
      })
      .catch(function (error: any) {
        console.log("Error sending message:", error.response.data);
        return error.response.data;
      });
  }
}

export default new WebhookRoute().router;
