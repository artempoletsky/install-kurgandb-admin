import { NextPOST, ValidationRule, Validator, validateArrayUnionFabric, validateUnionFabric } from "@artempoletsky/easyrpc";
import { Predicate } from "@artempoletsky/kurgandb";
import { TableScheme } from "@artempoletsky/kurgandb/table";
import { NextResponse } from "next/server";
import { query } from "../db";

import { FieldTag, FieldType, FieldTypes } from "@artempoletsky/kurgandb/globals";
import { PlainObject } from "../utils_client";
import { login, logout as userLogoout } from "@/app/kurgandb_admin/auth";

function methodFactory<PayloadType extends Record<string, any>, ReturnType>(predicate: Predicate<any, PayloadType>) {
  return async function (payload: PayloadType): Promise<ReturnType> {
    let res;
    try {
      res = await query(predicate, payload);
    } catch (err: any) {
      throw {
        message: err.message || err,
        invalidFields: {},
        status: 400,
      };
    }

    if (res.$kurganDB_admin_error) {
      throw res.$kurganDB_admin_error;
    }
    return res;
  }
}



type ACreateDocument = {
  tableName: string
  document: PlainObject
}

const VCreateDocument: ValidationRule<ACreateDocument> = {
  tableName: "string",
  document: "any",
};

const createDocument = methodFactory<ACreateDocument, string | number>(({ }, { db, payload }) => {
  const { tableName, document } = payload;
  let t = db.getTable(tableName);
  const id = t.insert(document);
  return id;
});


export type FCreateDocument = typeof createDocument;
/////////////////////////////////////////////////////

type AReadDocument = {
  tableName: string,
  id: string | number
}

const VReadDocument: ValidationRule<AReadDocument> = {
  tableName: "string",
  id: "any",
};

const readDocument = methodFactory<AReadDocument, PlainObject>(({ }, { db, payload, $ }) => {
  const { tableName, id } = payload;
  let t = db.getTable(tableName);
  return t.at(id, $.full);
});


export type FReadDocument = typeof readDocument;
/////////////////////////////////////////////////////


type AUpdateDocument = {
  tableName: string
  id: string | number
  document: PlainObject
}

const VUpdateDocument: ValidationRule<AUpdateDocument> = {
  tableName: "string",
  id: "any",
  document: "any",
};

const updateDocument = methodFactory<AUpdateDocument, undefined>(({ }, { db, payload }) => {
  const { tableName, document, id } = payload;

  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, id).update(doc => {
    for (const key in document) {
      doc.set(key, document[key]);
    }
  });
});

export type FUpdateDocument = typeof updateDocument;

/////////////////////////////////////////////////////


type ADeleteDocument = {
  tableName: string
  id: string | number
}

const VDeleteDocument: ValidationRule<ADeleteDocument> = {
  tableName: "string",
  id: "any",
};

const deleteDocument = methodFactory<ADeleteDocument, "">(({ }, { db, payload }) => {
  const { tableName, id } = payload;

  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, id).delete();
});

export type FDeleteDocument = typeof deleteDocument;

/////////////////////////////////////////////////////

type ATableOnly = {
  tableName: string
}

const VTableOnly: ValidationRule<ATableOnly> = {
  tableName: "string"
}

export const getScheme = methodFactory<ATableOnly, TableScheme>(({ }, { db, payload }) => {
  const { tableName } = payload;
  let t = db.getTable(tableName);
  return t.scheme;
});

export type FGetScheme = typeof getScheme;

/////////////////////////////////////////////////////

type AGetPage = {
  tableName: string
  queryString: string
  page: number
}

export type RGetPage = {
  documents: any[]
  pagesCount: number
}

const VGetPage: ValidationRule<AGetPage> = {
  tableName: "string",
  queryString: "string",
  page: "number",
}

const getPage = methodFactory<AGetPage, RGetPage>(({ }, { db, payload, $ }) => {
  const { tableName, queryString, page } = payload;
  let t = db.getTable(tableName);
  let table = t;
  let tq: any;
  if (!queryString) {
    tq = t.all().limit(0);
  } else {
    tq = eval(queryString).limit(0);
  }

  function paginage<Type>(array: Type[], page: number, pageSize: number) {
    // console.log(page);
    return {
      documents: array.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
      pagesCount: Math.ceil(array.length / pageSize),
    }
  }

  return paginage(<any[]>tq.select($.primary), page, 20);
});

export type FGetPage = typeof getPage;

/////////////////////////////////////////////////////

type AToggleTag = {
  tableName: string,
  fieldName: string,
  tagName: FieldTag,
}

const VToggleTag: ValidationRule<ATableOnly> = {
  tableName: "string"
}

export const toggleTag = methodFactory<AToggleTag, TableScheme>(({ }, { db, payload }) => {
  const { tableName, fieldName, tagName } = payload;
  let t = db.getTable(tableName);
  t.toggleTag(fieldName, tagName);

  return t.scheme;
});

export type FToggleTag = typeof toggleTag;


/////////////////////////////////////////



const getFreeId = methodFactory<ATableOnly, number | string>(({ }, { db, payload }) => {
  const { tableName } = payload;
  let t = db.getTable(tableName);
  return t.getFreeId();
});

export type FGetFreeId = typeof getFreeId;



///////////////////////////////////////////


const getDraft = methodFactory<ATableOnly, any>(({ }, { db, payload }) => {
  const { tableName } = payload;
  let t = db.getTable(tableName);
  return t.getDocumentDraft();
});

export type FGetDraft = typeof getDraft;



///////////////////////////////////////////

export type AAddField = {
  tableName: string
  fieldName: string
  type: FieldType
  isHeavy: boolean
}

const VAddField: ValidationRule<AAddField> = {
  tableName: "string",
  fieldName: ["string"],
  type: ["string", validateUnionFabric(FieldTypes)],
  isHeavy: "boolean",
}

const addField = methodFactory<AAddField, TableScheme>(({ }, { db, payload }) => {
  const { tableName, fieldName, type, isHeavy } = payload;
  let t = db.getTable(tableName);
  if (t.scheme.fields[fieldName]) {
    return {
      $kurganDB_admin_error: {
        message: "Bad request",
        invalidFields: {
          fieldName: {
            message: "already exists",
            userMessage: "name is already taken",
          }
        },
        status: 400,
      }
    }
  }
  t.addField(fieldName, type, isHeavy);
  return t.scheme;
});

export type FAddField = typeof addField;

///////////////////////////////////////////

type ARemoveField = {
  tableName: string
  fieldName: string
}

const VRemoveField: ValidationRule<ARemoveField> = {
  tableName: "string",
  fieldName: "string",
}

const removeField = methodFactory<ARemoveField, TableScheme>(({ }, { db, payload }) => {
  const { tableName, fieldName } = payload;
  let t = db.getTable(tableName);
  t.removeField(fieldName);
  return t.scheme;
});

export type FRemoveField = typeof removeField;


///////////////////////////////////////////

type AChangeFieldIndex = {
  tableName: string
  fieldName: string
  newIndex: number
}

const VChangeFieldIndex: ValidationRule<AChangeFieldIndex> = {
  tableName: "string",
  fieldName: "string",
  newIndex: "number",
}

const changeFieldIndex = methodFactory<AChangeFieldIndex, TableScheme>(({ }, { db, payload }) => {
  const { tableName, fieldName, newIndex } = payload;
  let t = db.getTable(tableName);
  t.changeFieldIndex(fieldName, newIndex);
  return t.scheme;
});

export type FChangeFieldIndex = typeof changeFieldIndex;

///////////////////////////////////////////

type ARenameField = {
  tableName: string
  fieldName: string
  newName: string
}

const VRenameField: ValidationRule<ARenameField> = {
  tableName: "string",
  fieldName: "string",
  newName: "string",
}

const renameField = methodFactory<ARenameField, TableScheme>(({ }, { db, payload }) => {
  const { tableName, fieldName, newName } = payload;
  let t = db.getTable(tableName);
  t.renameField(fieldName, newName)
  return t.scheme;
});

export type FRenameField = typeof renameField;

///////////////////////////////////////////

type ACreateTable = {
  tableName: string
  keyType: "string" | "number"
  autoIncrement: boolean
}

const VCreateTable: ValidationRule<ACreateTable> = {
  tableName: "string",
  keyType: ["string", validateUnionFabric(["string", "number"])],
  autoIncrement: "boolean",
}

const createTable = methodFactory<ACreateTable, TableScheme>(({ }, { db, payload }) => {
  const { tableName, keyType, autoIncrement } = payload;
  const primaryTags: FieldTag[] = autoIncrement ? ["primary", "autoinc"] : ["primary"];
  const t = db.createTable({
    name: tableName,
    fields: {
      id: keyType,
    },
    tags: {
      id: primaryTags
    },
  });

  return t.scheme;
});

export type FCreateTable = typeof createTable;

///////////////////////////////////////////

const removeTable = methodFactory<ATableOnly, void>(({ }, { db, payload }) => {
  const { tableName } = payload;
  db.removeTable(tableName);
});

export type FRemoveTable = typeof removeTable;

///////////////////////////////////////////
type AAuthorize = {
  userName: string
  password: string
};

const VAuthorize: ValidationRule<AAuthorize> = {
  userName: "string",
  password: "string",
};

const authorize = async ({ userName, password }: AAuthorize) => {
  return login(userName, password);
}

export type FAuthorize = typeof authorize;

///////////////////////////////////////////


const logout: () => Promise<void> = async () => {
  userLogoout();
}

export type FLogout = typeof logout;

///////////////////////////////////////////


import * as scripts from "../../kurgandb_admin/scripts";

type AExecuteScript = {
  args: string[]
  path: string
};

const VExecuteScript: ValidationRule<AExecuteScript> = {
  args: "stringEmpty[]",
  path: "string",
};

const executeScript = async ({ args, path }: AExecuteScript): Promise<string> => {
  const steps = path.split(".");
  let current: PlainObject | Function = scripts as PlainObject;
  while (steps.length > 1) {
    if (typeof current === "function") {
      return `function has been found to early at '${steps[0]}' in '${path}'`;
    }

    steps.shift();
    current = current[steps[0]];
  }
  if (typeof current != "function") {
    return `Script path '${path}' hasn't been found`;
  }

  const result = current(...args);

  return result || "";
}

export type FExecuteScript = typeof executeScript;

///////////////////////////////////////////



export const POST = NextPOST(NextResponse, {
  createDocument: VCreateDocument,
  readDocument: VReadDocument,
  updateDocument: VUpdateDocument,
  deleteDocument: VDeleteDocument,
  getScheme: VTableOnly,
  getPage: VGetPage,
  toggleTag: VToggleTag,
  getFreeId: VTableOnly,
  getDraft: VTableOnly,
  addField: VAddField,
  removeField: VRemoveField,
  changeFieldIndex: VChangeFieldIndex,
  renameField: VRenameField,
  createTable: VCreateTable,
  removeTable: VTableOnly,
  authorize: VAuthorize,
  logout: {},
  executeScript: VExecuteScript,
}, {
  createDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  getScheme,
  getPage,
  toggleTag,
  getFreeId,
  getDraft,
  addField,
  removeField,
  changeFieldIndex,
  renameField,
  createTable,
  removeTable,
  authorize,
  logout,
  executeScript,
});