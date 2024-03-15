"use client";
import { useErrorResponse } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";

import CustomComponentTable from "../../../kurgandb_admin/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";


export default function CustomComponentPage(props: { tableName: string, scheme: TableScheme, meta: any }) {

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