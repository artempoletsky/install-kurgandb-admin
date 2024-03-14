import { Predicate } from "@artempoletsky/kurgandb";
import { Table, TableScheme } from "@artempoletsky/kurgandb/globals";
import { queryUniversal as query } from "@artempoletsky/kurgandb";

import { FieldTag, PlainObject } from "@artempoletsky/kurgandb/globals";
import { login, logout as userLogout } from "../../kurgandb_admin/auth";
import type {
  AAddField,
  AAuthorize,
  AChangeFieldIndex,
  ACreateDocument,
  ACreateTable,
  ADeleteDocument,
  AExecuteScript,
  AGetDraft,
  AGetFreeId,
  AGetLog,
  AGetPage,
  AGetScheme,
  AReadDocument,
  ARemoveField,
  ARemoveTable,
  ARenameField,
  ATableOnly,
  AToggleAdminEvent,
  AToggleTag,
  AUnregisterEvent,
  AUpdateDocument
} from "./schemas";



type Tables = Record<string, Table<any, any, any>>;

export function methodFactory<Payload extends PlainObject, PredicateReturnType, ReturnType = PredicateReturnType>(predicate: Predicate<Tables, Payload, PredicateReturnType>, then?: (dbResult: PredicateReturnType, payload: Payload) => ReturnType) {
  return async function (payload: Payload) {
    let dbResult: PredicateReturnType;
    try {
      dbResult = await query(predicate, payload);
    } catch (err: any) {
      throw new ResponseError(err);
    }
    if (!then) return dbResult as unknown as ReturnType;
    return then(dbResult, payload);
  }
}

export const createDocument = methodFactory<ACreateDocument, string | number>((T, { tableName, document }, { db }) => {
  let t = db.getTable(tableName);
  const id = t.insert(document);
  return id;
});

export type FCreateDocument = typeof createDocument;
/////////////////////////////////////////////////////


export const readDocument = methodFactory(({ }, { tableName, id }: AReadDocument, { db, $ }) => {
  let t = db.getTable<any, any, any>(tableName);
  return t.at(id, $.full);
});


export type FReadDocument = typeof readDocument;
/////////////////////////////////////////////////////


export const updateDocument = methodFactory(({ }, { tableName, document, id }: AUpdateDocument, { db }) => {

  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, id).update(doc => {
    for (const key in document) {
      doc.$set(key as any, document[key]);
    }
  });
});

export type FUpdateDocument = typeof updateDocument;

/////////////////////////////////////////////////////


export const deleteDocument = methodFactory(({ }, { tableName, id }: ADeleteDocument, { db }) => {
  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, id).delete();
});

export type FDeleteDocument = typeof deleteDocument;

/////////////////////////////////////////////////////



export const getSchemeSafe = methodFactory(({ }, { tableName }: AGetScheme, { db }) => {
  return db.getScheme(tableName) || null;
});

export const getScheme = methodFactory(({ }, { tableName }: AGetScheme, { db }) => {
  let t = db.getTable(tableName);
  return t.scheme;
});

export type FGetScheme = typeof getScheme;

/////////////////////////////////////////////////////



export type RGetPage = {
  documents: any[]
  pagesCount: number
}


export const getPage = methodFactory<AGetPage, RGetPage>(({ }, { tableName, queryString, page }, { db, $ }) => {
  let t = db.getTable(tableName);
  let table = t;
  let tq: any;
  if (!queryString) {
    tq = t.all().limit(0);
  } else {
    try {
      tq = eval(queryString).limit(0);
    } catch (err) {
      throw new ResponseError(`Query string contains errors: {...}`, [err + ""]);
    }

  }

  function paginage<Type>(array: Type[], page: number, pageSize: number) {
    // console.log(page);
    return {
      documents: array.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
      pagesCount: Math.ceil(array.length / pageSize),
    }
  }

  return paginage(tq.select($.primary), page, 20);
});

export type FGetPage = typeof getPage;

/////////////////////////////////////////////////////


export const toggleTag = methodFactory<AToggleTag, TableScheme>(({ }, { tableName, fieldName, tagName }, { db }) => {
  let t = db.getTable(tableName);
  t.toggleTag(fieldName, tagName);

  return t.scheme;
});

export type FToggleTag = typeof toggleTag;


/////////////////////////////////////////



export const getFreeId = methodFactory<AGetFreeId, number | string>(({ }, { tableName }, { db }) => {
  let t = db.getTable(tableName);
  return t.getFreeId();
});

export type FGetFreeId = typeof getFreeId;



///////////////////////////////////////////


export const getDraft = methodFactory<AGetDraft, any>(({ }, { tableName }, { db }) => {
  let t = db.getTable(tableName);
  return t.getRecordDraft();
});

export type FGetDraft = typeof getDraft;



///////////////////////////////////////////


export const addField = methodFactory<AAddField, TableScheme>(({ }, { tableName, fieldName, type, isHeavy }, { db, $ }) => {
  let t = db.getTable(tableName);
  try {
    t.addField(fieldName, type, isHeavy);
  } catch (err) {
    // throw err;

    throw new $.ResponseError({
      invalidFields: {
        fieldName: {
          message: "Already taken {...} ({...})",
          args: [t.scheme.fields[fieldName], t.scheme.tags[fieldName].join(", ")],
        }
      }
    });

  }

  return t.scheme;
});

export type FAddField = typeof addField;

///////////////////////////////////////////

export const removeField = methodFactory<ARemoveField, TableScheme>(({ }, { tableName, fieldName }, { db }) => {
  let t = db.getTable(tableName);
  t.removeField(fieldName);
  return t.scheme;
});

export type FRemoveField = typeof removeField;


///////////////////////////////////////////

export const changeFieldIndex = methodFactory<AChangeFieldIndex, TableScheme>(({ }, { tableName, fieldName, newIndex }, { db }) => {
  let t = db.getTable(tableName);
  t.changeFieldIndex(fieldName, newIndex);
  return t.scheme;
});

export type FChangeFieldIndex = typeof changeFieldIndex;

///////////////////////////////////////////


export const renameField = methodFactory<ARenameField, TableScheme>(({ }, { tableName, fieldName, newName }, { db }) => {
  let t = db.getTable(tableName);
  t.renameField(fieldName, newName)
  return t.scheme;
});

export type FRenameField = typeof renameField;

///////////////////////////////////////////





export const createTable = methodFactory<ACreateTable, TableScheme>(({ }, { tableName, keyType, autoIncrement }, { db }) => {
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

export const removeTable = methodFactory<ARemoveTable, void>(({ }, { tableName }, { db }) => {
  db.removeTable(tableName);
});

export type FRemoveTable = typeof removeTable;

///////////////////////////////////////////


export const authorize = async ({ userName, password }: AAuthorize) => {
  const success = await login(userName, password);
  if (!success) throw new ResponseError("Incorrect username or password.");
  return success;
}

export type FAuthorize = typeof authorize;

///////////////////////////////////////////


export const logout: () => Promise<void> = async () => {
  await userLogout();
}

export type FLogout = typeof logout;

///////////////////////////////////////////





export type ScriptsLogRecord = {
  time: number
  result: string
};

import * as scripts from "../../kurgandb_admin/scripts";
import { ResponseError } from "@artempoletsky/easyrpc";
export const executeScript = async ({ args, path }: AExecuteScript): Promise<ScriptsLogRecord> => {
  const steps = path.split(".");
  let current: PlainObject | Function = scripts as PlainObject;
  let self = current;
  while (steps.length > 1) {
    if (typeof current === "function")
      throw new ResponseError(`function has been found to early at '${steps[0]}' in '${path}'`);


    steps.shift();
    self = current;
    current = current[steps[0]];
  }
  if (typeof current != "function")
    throw new ResponseError(`Script path '${path}' hasn't been found`);


  const t1 = performance.now();
  let result = await current.apply(self, args);
  if (result === undefined) {
    result = "Success!";
  }

  return {
    time: Math.floor(performance.now() - t1),
    result,
  }
}

export type FExecuteScript = typeof executeScript;


export const getAllTables = methodFactory(({ }, { }, { db }) => {
  const tables = db.getTables();
  return {
    version: db.versionString,
    tableNames: Object.keys(tables),
  };
});

export type FGetAllTables = () => Promise<ReturnType<typeof getAllTables>>;




export const getLogsList = methodFactory(({ }, { }, { db }) => {
  return db.getLogsList();
});
export type FGetLogsList = () => Promise<ReturnType<typeof getLogsList>>;


export const getLog = methodFactory(({ }, { fileName }: AGetLog, { db }) => {
  return db.getLog(fileName);
});
export type FGetLog = typeof getLog;

import * as AdminEvents from "../../kurgandb_admin/events";
import { ParsedFunction, parseFunction } from "@artempoletsky/kurgandb/function";


export const getTableEvents = methodFactory(({ }, { tableName }: ATableOnly, { db }) => {
  const t = db.getTable(tableName);
  return t.getRegisteredEventListeners();
}, (registeredEvents, { tableName }) => {
  const evs = (AdminEvents as any)[tableName] || {};
  return {
    adminEvents: Object.keys(evs),
    registeredEvents,
  }
});

export type FGetTableEvents = typeof getTableEvents;

export async function toggleAdminEvent({ eventName, tableName }: AToggleAdminEvent) {

  type Payload = AToggleAdminEvent & {
    fun: ParsedFunction
  }
  const evs = (AdminEvents as any)[tableName];
  if (!evs) throw new ResponseError("Can't find events for table {...}", [tableName]);
  const funRaw: Function = evs[eventName];
  if (!funRaw) throw new ResponseError("Can't find event {...} for table {...}", [eventName, tableName]);

  const fun = parseFunction(funRaw);
  return await query(({ }, { tableName, eventName, fun }: Payload, { db }) => {
    const t = db.getTable(tableName);
    const result = !t.hasEventListener(eventName, "admin");
    if (result) {
      t.registerEventListenerParsed("admin", eventName, fun);
    } else {
      t.unregisterEventListener("admin", eventName);
    }

    return t.getRegisteredEventListeners();
  }, {
    eventName,
    tableName,
    fun,
  });
}
export type FToggleAdminEvent = typeof toggleAdminEvent;

export const unregisterEvent = methodFactory(({ }, { tableName, namespaceId, eventName }: AUnregisterEvent, { db }) => {
  const t = db.getTable(tableName);
  t.unregisterEventListener(namespaceId, eventName);
  return t.getRegisteredEventListeners();
});

export type FUnregisterEvent = typeof unregisterEvent;