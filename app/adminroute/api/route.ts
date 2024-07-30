import validate, { APIRequest, requestToRPCRequest } from "@artempoletsky/easyrpc";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/kurgandb/auth";

import * as schemas from "./schemas";

import { customAPI, customRules } from "../../../lib/kurgandb/api";
import { JSONErrorResponse } from "@artempoletsky/easyrpc/client";
import { DB_TYPE } from "../generated";

let API;
if (DB_TYPE == "kurgandb") {
  API = require("./methods");
} else {
  API = require("./methods_prisma");
}


export const POST = async function name(request: NextRequest) {


  let bIsAdmin = await isAdmin();
  if (bIsAdmin === undefined) {
    bIsAdmin = true;
  }
  let req: APIRequest<Record<string, any>>;


  try {
    req = await requestToRPCRequest(request);
  } catch (err) {
    return NextResponse.json(err, {
      status: (<JSONErrorResponse>err).statusCode
    });
  }

  if (!bIsAdmin && req.method !== "authorize") {
    const err: JSONErrorResponse = {
      message: "You must authorize to perform this action",
      preferredErrorDisplay: "form",
      statusCode: 403,
      args: [],
      invalidFields: {}
    };
    return NextResponse.json(err, {
      status: 403
    });
  }


  let result, status;

  // console.log(Object.keys(schemas).length, Object.keys(schemas));

  [result, status] = await validate(req, {
    ...schemas,
    ...customRules,
  }, {
    ...API,
    ...customAPI,
  });


  return NextResponse.json(result, status);
}

