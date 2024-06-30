import { InvoiceModel } from "../../models/invoice/invoice.model";
import { BaseRoute, Request, Response } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import * as CryptoJS from "crypto-js";
import { OrderModel } from "../../models/order/order.model";
import { OrderStatusEnum } from "../../constants/model.const";
const axios = require("axios").default;
var crypto = require("crypto");

class WebhookRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.post("/9payment", this.route(this.ninePay));
  }

  async ninePay(req: Request, res: Response) {
    const data = req.body;
    console.log(data);
    const checksum_key = process.env.checkSumKey;
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
    if ([5, 16].includes(parseText.status)) {
      order.isPaid = true;
      order.status = OrderStatusEnum.PENDING;
      await order.save();
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      parseText,
    });
  }
}

export default new WebhookRoute().router;
