"use client";
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import { useErrorResponse } from "@artempoletsky/easyrpc/react";

import CustomComponentTable from "../../../kurgandb_admin/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";
import { useEffect, useState } from "react";
import type { FGetTableCustomPageData, RGetTableCustomPageData } from "../../api/methods";
import { API_ENDPOINT } from "../../generated";
import { TableScheme } from "@artempoletsky/kurgandb/globals";
import { Store } from "../../StoreProvider";


const getTableCustomPageData = getAPIMethod<FGetTableCustomPageData>(API_ENDPOINT, "getTableCustomPageData");

type Props = {
  tableName: string;
  scheme: TableScheme;
  meta: any;
}

export default function PageCustomComponent(props: Props) {
  Store.setBreadcrumbs([
    { href: "/", title: "Tables" },
    { href: `/${props.tableName}/`, title: props.tableName },
    { href: "", title: "Custom" },
  ]);
  const [setRequestError, , requestError] = useErrorResponse();
  return (
    <div className="">
      <CustomComponentTable
        {...props}
        onRequestError={setRequestError}
      />
      <RequestError requestError={requestError} />
    </div>
  );
}