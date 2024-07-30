"use client";
import { useErrorResponse } from "@artempoletsky/easyrpc/react";

import CustomComponentTable from "../../../../lib/kurgandb/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";
import { TableScheme } from "@artempoletsky/kurgandb/globals";
import { useStoreEffectSet } from "../../store";


type Props = {
  tableName: string;
  scheme: TableScheme;
  meta: any;
}

export default function PageCustomComponent(props: Props) {

  const [setRequestError, , requestError] = useErrorResponse();
  useStoreEffectSet("onRequestError", setRequestError);
  useStoreEffectSet("tableName", props.tableName);
  useStoreEffectSet("tableScheme", props.scheme);
  return (
    <div className="">
      <CustomComponentTable
        {...props}
      />
      <RequestError requestError={requestError} />
    </div>
  );
}