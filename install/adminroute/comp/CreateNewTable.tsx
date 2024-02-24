"use client";

import { Button, Checkbox, Select, Tooltip } from "@mantine/core";
import TextInput from "./TextInput";
import { ValidationErrorResponce, getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FCreateTable } from "../api/route";
import { useState } from "react";
import CheckboxTooltip from "./CheckboxTooltip";
import RequestError from "./RequestError";
import { API_ENDPOINT } from "../generated";

const createTable = getAPIMethod<FCreateTable>(API_ENDPOINT, "createTable");


export default function CreateNewTable() {
  let [requestError, setRequestError] = useState<ValidationErrorResponce | undefined>(undefined);
  let [tableName, setTableName] = useState("");
  let [keyType, setKeyType] = useState<"string" | "number">("number");
  let [autoIncrement, setAutoIncrement] = useState(true);

  function redirectToCreatedTable() {
    window.location.href += "/" + tableName;
  }

  function onCreateTable() {
    setRequestError(undefined);
    if (keyType == "string") {
      autoIncrement = false;
    }

    createTable({
      tableName,
      keyType,
      autoIncrement,
    })
      .then(redirectToCreatedTable)
      .catch(setRequestError)
  }

  return <div className="pl-5 w-[350px]">
    <p className="mb-1">Create a new table:</p>
    <div className="">
      <div className="">
        <TextInput
          error={requestError?.invalidFields.tableName?.userMessage}
          placeholder="table name" value={tableName}
          onChange={e => setTableName(e.target.value)}
        />
      </div>
      <div className="">
        <Select label="ID type" value={keyType} data={["string", "number"]} onChange={e => setKeyType(e as any)} />
      </div>
      {keyType == "number" &&
        <div className="mb-2">
          <CheckboxTooltip
            onChange={setAutoIncrement}
            value={autoIncrement}
            tooltip="Uncheck if you want to manage ID generation manually"
            label="auto increment"
          />
        </div>}
      <div className="mt-3">
        <Button onClick={onCreateTable}>Create</Button>
      </div>
      <RequestError requestError={requestError} />

    </div>
  </div>
}