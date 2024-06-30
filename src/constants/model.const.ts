export enum UserRoleEnum {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  // STAFF = "STAFF",
}
export enum OrderStatusEnum {
  UNPAID = "UNPAID",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DELIVERING = "DELIVERING",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL",
  //IN_CART = "IN_CART",
}

export enum paymentMethodEnum {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  WALLET = "WALLET",
}

export enum ShoppingCartStatusEnum {
  IN_CART = "IN_CART",
  SUCCESS = "SUCCESS",
}
export enum PaymentStatusEnum {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}
