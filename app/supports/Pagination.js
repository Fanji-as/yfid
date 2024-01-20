import { prisma } from "../models/index.js";
import collect from "collect.js";
import _ from "lodash";

/**
 * @typedef {{
 *   size: number;
 *   number: number;
 * }} Page
 * @typedef {{
 *   [key: string]: any;
 * }} Filter
 * @typedef {{
 *   [key: string]: import("../models/index.js").prisma.Prisma.SortOrder;
 * }} Sort
 * @typedef {string[]} Include
 * @typedef {{
 *   currentPage: Page["number"];
 *   from: number;
 *   lastPage: number;
 *   recordPerPage: number;
 *   to: number;
 *   total: number;
 *   prev: number;
 *   next: number;
 *   filter?: Filter;
 *   sort?: Sort;
 * }} Meta
 * @typedef {{
 *   limit?: number;
 *   page?: number;
 * }} RequestQuery
 */
export class Pagination {
  /** @type {Page} */
  static defaultPage = {
    size: 10,
    number: 1,
  };

  /** @type {Page} */
  page;

  /** @type {Filter | undefined} */
  filter = undefined;

  /** @type {Sort | undefined} */
  sort = undefined;

  /** @type {Include | undefined} */
  include = undefined;

  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = _.merge(_.clone(Pagination.defaultPage), page);
  }

  getSkip() {
    return Number((this.page.number - 1) * this.page.size);
  }

  /**
   * @param {string[]} allowedKeys
   */
  setFilter(filter, allowedKeys) {
    this.filter = collect(allowedKeys)
      .mapWithKeys(key => [
        key,
        filter === undefined || filter[key] === undefined
          ? undefined
          : filter[key].split(","),
      ])
      .filter()
      .all();

    return this;
  }

  /**
   * @param {string[]} allowedKeys
   */
  setSort(sort, allowedKeys) {
    if (typeof sort === "string") {
      sort = sort.split(",");

      this.sort = (() => {
        let result = {};

        allowedKeys.forEach(key => {
          if (sort.includes(key)) {
            result[key] = prisma.Prisma.SortOrder.asc;
          } else if (sort.includes(`-${key}`)) {
            result[key] = prisma.Prisma.SortOrder.desc;
          }
        });

        return result;
      })();
    }

    return this;
  }

  /**
   * @param {string[]} allowedKeys
   * @returns {Array<string>}
   */
  setInclude(include, allowedKeys) {
    if (typeof sort === "string") {
      include = include.split(",");

      this.include = (() => {
        let result = {};

        allowedKeys.forEach(key => {
          if (include.includes(key)) {
            result.push(key);
          }
        });

        return result;
      })();
    }

    return this;
  }

  /**
   * @param {Meta["total"]} total
   * @param {Meta["recordPerPage"]} recordPerPage
   * @returns {Meta}
   */
  generateMeta(total, recordPerPage) {
    const skip = (this.page.number - 1) * this.page.size;
    const lastPage = Math.ceil(total / this.page.size);

    return {
      currentPage: this.page.number,
      from: skip + 1,
      lastPage,
      recordPerPage,
      to: Math.min(skip + this.page.size, total),
      total,
      next: Math.min(this.page.number + 1, lastPage),
      prev: Math.max(1, this.page.number - 1),
    };
  }
}
