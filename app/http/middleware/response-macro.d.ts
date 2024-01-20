import { Meta } from "../../supports/Pagination.js";
import ErrorStackParser from "error-stack-parser";
import { NextFunction, Request, Response } from "express";
import * as http from "http";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

declare module "express-serve-static-core" {
  interface Response<ResBody = any>
    extends http.ServerResponse,
      Express.Response {
    /**
     * Send JSON response using Shipper format.
     *
     * Examples:
     *
     *     res.formattedJson({ data: { user: 'tj' } });
     *     res.formattedJson({ data: [ { user: 'tj' } ] });
     *     res.status(500).formattedJson({ data: { user: 'tj' } });
     *     res.status(404).formattedJson({ data: [ { user: 'tj' } ] });
     */
    formattedJson: Send<FormattedJsonResponseBody<{ data: ResBody }>, this>;

    /**
     * Send JSON response contains pagination data using Shipper format.
     *
     * Examples:
     *
     *     res.formattedJson({ data: { user: 'tj' }, meta: { currentPage: 1 } });
     *     res.formattedJson({ data: [ { user: 'tj' } ], meta: { currentPage: 1 } });
     *     res.status(500).formattedJson({ data: { user: 'tj' }, meta: { currentPage: 1 } });
     *     res.status(404).formattedJson({ data: [ { user: 'tj' } ], meta: { currentPage: 1 } });
     */
    formattedJsonPagination: (
      body: FormattedJsonPaginationResponseBody<{
        data: ResBody;
        pagination: Meta;
      }>,
    ) => this;
  }
}

export interface FormattedJsonResponseBody<ResBody extends { data: any }> {
  metadata: {
    /**
     * @description Request url path.
     * @example ```/v1/app-version```
     */
    path: Request["url"];

    /**
     * @description HTTP status code.
     * @example ```200```
     */
    http_status_code: StatusCodes;

    /**
     * @description HTTP reason phrase from the given HTTP status code.
     * @example ```OK```
     */
    http_status: ReasonPhrases;

    /**
     * @description Error details.
     */
    errors?: {
      status: StatusCodes;
      message: string;
    }[];

    /**
     * @description Error object extracted the most information from it.
     */
    traces?: ErrorStackParser.StackFrame[];

    /**
     * @description Unix timestamp.
     * @example ```1703669965```
     */
    timestamp: number;
  };

  data: ResBody["data"];

  pagination?: {
    current_page: number;
    current_elements: number;
    total_pages: number;
    total_elements: number;
    sort_by?: string[];
  };
}

export interface FormattedJsonPaginationResponseBody<
  ResBody extends { data: any; pagination: Meta },
> extends FormattedJsonResponseBody<ResBody> {
  pagination: Meta;
}

export default function (req: Request, res: Response, next: NextFunction): void;
