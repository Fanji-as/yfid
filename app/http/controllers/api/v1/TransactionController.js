import { Midtrans } from "../../../../supports/Midtrans.js";

export class TransactionController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  // eslint-disable-next-line no-unused-vars
  static async store(req, res, next) {
    const token = await new Midtrans().snap.createTransaction(req.body);

    return res.json({ data: token });
  }
}
