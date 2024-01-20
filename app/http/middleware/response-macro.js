import { dateToUnixTimestamp } from "../../supports/helpers.js";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import _ from "lodash";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function (req, res, next) {
  /**
   * @param {Parameters<import("express").Response["formattedJson"]>[0]} body
   */
  res.formattedJson = function (body) {
    const http_status_code = res.statusCode || StatusCodes.OK;

    /** @type {import("./response-macro.d.ts").FormattedJsonResponseBody["metadata"]} */
    const metadata = {
      path: `${req.baseUrl}${req.url}`,
      http_status_code,
      http_status: getReasonPhrase(http_status_code),
      timestamp: dateToUnixTimestamp(new Date()),
    };

    return res.status(http_status_code).json(_.merge({ metadata }, body));
  };

  /**
   * @param {Parameters<import("express").Response["formattedJsonPagination"]>[0]} body
   */
  res.formattedJsonPagination = function (body) {
    const { pagination } = body;

    return res.formattedJson({
      ...body,
      pagination: {
        current_page: pagination.currentPage,
        current_elements: pagination.recordPerPage,
        total_pages: pagination.lastPage,
        total_elements: pagination.total,
      },
    });
  };

  return next();
}
