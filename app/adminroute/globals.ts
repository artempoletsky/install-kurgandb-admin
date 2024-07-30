import { JSONErrorResponse, RequestErrorSetter } from "@artempoletsky/easyrpc/client";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { RPC } from "@artempoletsky/easyrpc/client";
import * as API from "./api/methods";
import { API_ENDPOINT } from "./generated";
import { customAPI } from "../../lib/kurgandb/api";
import { EditDocumentFormProps } from "./[tableName]/records/EditDocumentForm";



export type ScriptsRecord = Record<string, (args: any) => void>;
export type FieldScriptsObject = Record<string, Record<string, ScriptsRecord>>;


export type TableComponentProps = {
  meta: any;
}

export type DocumentComponentProps<Type = PlainObject> = {
  // onUpdateRecord: (record: PlainObject) => void;
  record: Type & PlainObject;
  initialRecord: Type & PlainObject;
  insertMode?: boolean;
  recordId: string | number | undefined;
  formProps: EditDocumentFormProps;
}


export function adminRPC() {
  return RPC<typeof API>(API_ENDPOINT);
}

export function adminRPCCustom() {
  return RPC<typeof customAPI>(API_ENDPOINT);
}

export type DATABASE_TYPE = "kurgandb" | "prisma";


export function getPrimaryKeyFromScheme(scheme: TableScheme) {
  return Object.keys(scheme.tags).find(id => {
    return scheme.tags[id]?.includes("primary") || false;
  })!;
}

export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}