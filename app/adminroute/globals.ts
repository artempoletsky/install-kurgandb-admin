import { JSONErrorResponse, RequestErrorSetter } from "@artempoletsky/easyrpc/client";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";





export type ScriptsRecord = Record<string, (args: any) => void>;
export type FieldScriptsObject = Record<string, Record<string, ScriptsRecord>>;


export function formatCamelCase(str: string) {
  let result = "";
  let i = 0;
  let lastCharLetter = false;
  let lastCharLowerCase = false;
  for (let char of str) {
    if (i == 0) {
      char = char.toUpperCase();
    }

    const currentCharNumber = char.match(/[0-9]/);
    if (lastCharLetter && currentCharNumber) {
      char = " " + char;
    }

    const currentCharCapital = char.match(/[A-Z]/);

    if (lastCharLowerCase && currentCharCapital) {
      char = " " + char;
    }

    result += char;
    i++;
    lastCharLetter = !currentCharNumber;
    lastCharLowerCase = !currentCharCapital;
  }

  return result;
}


export type TableComponentProps = {
  onRequestError: RequestErrorSetter;
  tableName: string;
  scheme: TableScheme;
  meta: any;
}

export type DocumentComponentProps = {
  onRequestError: (e: JSONErrorResponse) => void
  // onUpdateRecord: (record: PlainObject) => void
  tableName: string
  record: PlainObject
  insertMode?: boolean
  recordId: string | number | undefined
}
