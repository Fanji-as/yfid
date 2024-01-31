import { model as defaultModel } from "../models/index.js";
import { Pagination } from "../supports/Pagination.js";
import _ from "lodash";

/**
 * @typedef {import("../models/index.js").prisma.User} User
 * @typedef {import("../models/index.js").prisma.Prisma.UserDelegate} Model
 */
export class UserRepository {
  /** @type {Model} */
  model;

  /**
   * @param {Model} [model]
   */
  constructor(model) {
    this.model = model || defaultModel.user;
  }

  /**
   * @param {import("../supports/Pagination.js").Page} page
   * @param {Parameters<Model["findMany"]>["0"]} args
   */
  async paginate(page, args = undefined) {
    const pagination = new Pagination(page);

    const [total, data] = await Promise.all([
      this.model.count({ ..._.omit(args, ["select", "include", "distinct"]) }),
      this.model.findMany({
        skip: pagination.getSkip(),
        take: pagination.page.size,
        ...args,
      }),
    ]);

    return { data, pagination: pagination.generateMeta(total, data.length) };
  }
}
