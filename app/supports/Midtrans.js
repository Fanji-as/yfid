import crypto from "crypto";
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

export class Midtrans {
  /**
   * @param {string} serverKey
   * @param {string} clientKey
   * @param {boolean} isProduction
   */
  constructor(serverKey, clientKey, isProduction = true) {
    this.serverKey = this.getServerKey(serverKey);
    this.clientKey = this.getclientKey(clientKey);
    this.isProduction = this.getIsProduction(isProduction);
  }

  /**
   * @param {string} [serverKey]
   */
  getServerKey(serverKey) {
    if (serverKey === undefined) {
      dotenv.config();

      return process.env.MIDTRANS_SERVER_KEY;
    }

    return serverKey;
  }
  /**
   * @param {string} [clientKey]
   */
  getclientKey(clientKey) {
    if (clientKey === undefined) {
      dotenv.config();

      return process.env.MIDTRANS_CLIENT_KEY;
    }

    return clientKey;
  }

  /**
   * @param {boolean} [isProduction]
   */
  getIsProduction(isProduction) {
    if (isProduction === undefined) {
      dotenv.config();

      return process.env.NODE_ENV === "production";
    }

    return isProduction;
  }

  snap() {
    return new midtransClient.Snap({
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    });
  }

  coreApi() {
    return new midtransClient.CoreApi({
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    });
  }

  /**
   * @param {string} value
   * @param {{ order_id: string; status_code: string; gross_amount: string; }} body
   */
  validateSignatureKey(value, body = {}) {
    const hash = crypto.createHash("sha512");
    const data = hash.update(
      body.order_id + body.status_code + body.gross_amount + this.serverKey,
      "utf-8",
    );
    const signatureKey = data.digest("hex");

    return value === signatureKey;
  }
}
