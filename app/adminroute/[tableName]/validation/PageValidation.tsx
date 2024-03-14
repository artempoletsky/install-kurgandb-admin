"use client";

import { fetchCatch, getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";
import { ReactNode, useState } from "react";
import { ActionIcon, Button } from "@mantine/core";
import { FGetInvalidRecords, FSetCurrentTableValidator, FUnsetCurrentTableValidator } from "../../api/methods";
import { API_ENDPOINT } from "../../generated";
import { Trash } from "tabler-icons-react";
import { ParsedFunction } from "@artempoletsky/kurgandb/function";
import { ParsedFunctionComponent } from "../../comp/ParsedFunctionComponent";
import type { PlainObject } from "@artempoletsky/kurgandb/globals";

const setCurrentTableValidator = getAPIMethod<FSetCurrentTableValidator>(API_ENDPOINT, "setCurrentTableValidator");
const unsetCurrentTableValidator = getAPIMethod<FUnsetCurrentTableValidator>(API_ENDPOINT, "unsetCurrentTableValidator");
const getInvalidRecords = getAPIMethod<FGetInvalidRecords>(API_ENDPOINT, "getInvalidRecords");



type Props = {
  adminValidator: ParsedFunction | undefined;
  currentValidator: ParsedFunction;
  tableName: string;
  primaryKey: string;
  // invalidRecords: PlainObject[];
};

export default function TestComponent({
  adminValidator,
  currentValidator: initialCurrentValidator,
  tableName,
  primaryKey,
  // invalidRecords: invalidRecordsInitial
}: Props) {

  const [currentValidator, setCurrentValidator] = useState(initialCurrentValidator);
  const [invalidRecords, setInvalidRecords] = useState<PlainObject[]>([]);
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();


  function showSuccess(current: ParsedFunction) {
    setCurrentValidator(current);
    alert("Success!");
  }
  const doSet = fetchCatch(setCurrentTableValidator)
    .before(() => ({
      tableName,
    }))
    .then(showSuccess)
    .catch(setErrorResponse)
    .action();

  const doUnset = fetchCatch(unsetCurrentTableValidator)
    .before(() => ({
      tableName,
    }))
    .then(showSuccess)
    .catch(setErrorResponse)
    .action();

  const doGetInvalidRecords = fetchCatch(getInvalidRecords)
    .before(() => ({
      tableName,
    }))
    .then(console.log)
    .catch(setErrorResponse)
    .action();

  return (
    <div className="">
      <div className="flex">
        <div className="w-[550px] pr-3 border-r border-stone-500">
          <p className="font-bold text-xl mb-5">Admin validator:</p>
          <Button onClick={doSet}>Activate</Button>
          {adminValidator && <ParsedFunctionComponent {...adminValidator} />}
        </div>
        <div className="pl-3 w-[550px]">
          <p className="font-bold text-xl mb-5">Current validator:</p>
          <ParsedFunctionComponent onRemoveClick={doUnset} name="Current validator" {...currentValidator} />
        </div>
      </div>
      <div className="">
        <Button onClick={doGetInvalidRecords}>Get invalid records</Button>
        { }
      </div>
      <div className="text-red-600 min-h-[24px]">{mainErrorMessage}</div>

    </div>
  );
}