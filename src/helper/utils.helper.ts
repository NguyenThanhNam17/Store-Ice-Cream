export class UtilsHelper {
  constructor() {}
  static parsePhone(phone: string, pre: string) {
    if (!phone) return phone;
    let newPhone = "" + phone;
    newPhone = newPhone
      .replace(/^\+84/i, pre)
      .replace(/^\+0/i, pre)
      .replace(/^0/i, pre)
      .replace(/^84/i, pre);
    return newPhone;
  }
}
