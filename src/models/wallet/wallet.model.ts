import mongoose, { Schema } from "mongoose";
import {BaseDocument} from "../../base/baseModel";

export type IWallet = BaseDocument & {
    userId?: string;
    balance?: number;
    passCode?:number;
};

const walletSchema = new mongoose.Schema({
    userId:{type:Schema.Types.ObjectId, ref:"User"},
    balance:{type:Number},
    passCode:{type:Number},
},
{timestamps:true}
)

const WalletModel =mongoose.model<IWallet>("Wallet", walletSchema);
export {WalletModel};