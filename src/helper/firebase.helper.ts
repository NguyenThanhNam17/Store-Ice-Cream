import * as admin from "firebase-admin";
import { ErrorHelper } from "../base/error";

export class FirebaseHelper {
  app: admin.app.App;
  constructor() {
    let config: any = process.env.FIREBASE;
    config.credential = admin.credential.cert(config.credential);
    config.storageBucket = "bookstore-658a2.appspot.com";
    this.app = admin.initializeApp(config);
  }

  get messaging() {
    return this.app.messaging();
  }
  async verifyIdToken(token: string) {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (err) {
      throw ErrorHelper.badToken();
    }
  }
}

const firebaseHelper = new FirebaseHelper();

export { firebaseHelper };
