import { CrudService } from "../../base/crudService";
import { InvoiceModel } from "./invoice.model";

class InvoiceService extends CrudService<typeof InvoiceModel> {
  constructor() {
    super(InvoiceModel);
  }
}

const invoiceService = new InvoiceService();

export { invoiceService };
