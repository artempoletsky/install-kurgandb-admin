import validate, { APIRequest } from "@artempoletsky/easyrpc";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../kurgandb_admin/auth";

import * as schemas from "./schemas";

import { customAPI, customRules } from "../../kurgandb_admin/api";
import { JSONErrorResponse } from "@artempoletsky/easyrpc/client";
import { DB_TYPE } from "../generated";

let API;
if (DB_TYPE == "kurgandb") {
  API = require("./methods");
} else {
  API = require("./methods_prisma");
}


export const POST = async function name(request: NextRequest) {
  const req: APIRequest = await request.json();
  let bIsAdmin = await isAdmin();
  if (bIsAdmin === undefined) {
    bIsAdmin = true;
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

