import { PrismaClient } from "@prisma/client";

import { Predicate } from "@artempoletsky/kurgandb";
import { PluginFactory, Table, TableScheme } from "@artempoletsky/kurgandb/globals";
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
  AQueryRecords as AQueryRecords,
  AGetScheme,
  AReadDocument,
  ARemoveField,
  ARemoveTable,
  ARenameField,
  ATableOnly,
  AToggleAdminEvent,
  AToggleTag,
  AUnregisterEvent,
  AUpdateDocument,
  ATogglePlugin
} from "./schemas";


export type CompType<Type extends (arg: any) => Promise<any>> = Awaited<ReturnType<Type>> & Parameters<Type>[0];

type Tables = Record<string, Table<any, any, any>>;

function methodFactory<Payload extends PlainObject, PredicateReturnType, ReturnType = PredicateReturnType>(predicate: Predicate<Tables, Payload, PredicateReturnType, {}>, then?: (dbResult: PredicateReturnType, payload: Payload) => ReturnType) {
  return async function (payload: Payload) {
    let dbResult: PredicateReturnType;
    dbResult = await query(predicate, payload);
    if (!then) return dbResult as unknown as ReturnType;
    return then(dbResult, payload);
  }
}

export async function createDocument({ tableName, document }: ACreateDocument) {
  const helper = getPrismaHelper(tableName);

  const rec = await helper.table.create({
    data: document,
  });

  return rec[helper.primaryKey];
}

export type FCreateDocument = typeof createDocument;
/////////////////////////////////////////////////////


export async function readDocument({ tableName, id }: AReadDocument) {
  // const prisma = getPrismaClient();
  const helper = getPrismaHelper(tableName);

  return await helper.table.findUnique({
    where: {
      [helper.primaryKey]: id,
    }
  });
};


export type FReadDocument = typeof readDocument;
/////////////////////////////////////////////////////


export async function updateDocument({ tableName, document, id }: AUpdateDocument) {
  const helper = getPrismaHelper(tableName);   
  await helper.table.update({
    where: {
      [helper.primaryKey]: id,
    },
    data: document,
  });
};

export type FUpdateDocument = typeof updateDocument;

/////////////////////////////////////////////////////


export const deleteDocument = methodFactory(({ }, { tableName, id }: ADeleteDocument, { db }) => {
  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, <any>id).delete();
});

export type FDeleteDocument = typeof deleteDocument;

/////////////////////////////////////////////////////



export const getSchemeSafe = methodFactory(({ }, { tableName }: AGetScheme, { db }) => {
  return db.getScheme(tableName) || null;
});


export async function getScheme({ tableName }: AGetScheme): Promise<TableScheme> {
  const helper = getPrismaHelper(tableName);
  return helper.kdbScheme;
};

export type FGetScheme = typeof getScheme;

export async function getSchemePage(args: AGetScheme) {
  const scheme = await getScheme(args);
  return {
    scheme,
  }
}

export type FGetSchemePage = typeof getSchemePage;
export type RGetSchemePage = Awaited<ReturnType<FGetSchemePage>>;


/////////////////////////////////////////////////////



export type RQueryRecords = {
  documents: any[];
  pagesCount: number;
}



export async function queryRecords({ tableName, queryString, page }: AQueryRecords): Promise<RQueryRecords> {

  // let table = t;
  const pageSize = 20;
  const helper = getPrismaHelper(tableName);

  const records: any[] = await helper.table.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      [helper.primaryKey]: true,
    }
  });

  const pagesCount = Math.ceil(await helper.table.count() / pageSize);
  return {
    pagesCount,
    documents: records.map(rec => rec[helper.primaryKey]),
  }
};

export type FQueryRecords = typeof queryRecords;

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


export async function getDraft({ tableName }: AGetDraft) {
  return getPrismaHelper(tableName).getDraft();
}

export type FGetDraft = typeof getDraft;



///////////////////////////////////////////


export const addField = methodFactory<AAddField, TableScheme>(({ }, { tableName, fieldName, type, isHeavy }, { db, $ }) => {
  let t = db.getTable(tableName);
  t.addField(fieldName, type, isHeavy);
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
  let result;
  try {
    result = await current.apply(self, args);
  } catch (err) {
    return {
      time: Math.floor(performance.now() - t1),
      result: err + "",
    }
  }

  if (result === undefined) {
    result = "Success!";
  }

  return {
    time: Math.floor(performance.now() - t1),
    result,
  }
}

export type FExecuteScript = typeof executeScript;


export const getDBVersion = methodFactory(({ }, { }: {}, { db }) => {
  return db.versionString;
}, dbVersion => {
  return {
    adminVersion: `KurganDB admin v${ADMIN_VERSION}`,
    dbVersion,
  };
});

export type FGetDBVersion = typeof getDBVersion;

export async function getAllTables() {
  return getPrismaModels();
};

export type FGetAllTables = typeof getAllTables;

export async function getAllTablesPage() {
  return {
    tables: await getAllTables(),
  }
}
export type FGetAllTablesPage = typeof getAllTablesPage;


export const getLogsList = methodFactory(({ }, { }, { db }) => {
  return db.getLogsList();
});
export type FGetLogsList = () => Promise<ReturnType<typeof getLogsList>>;

export async function getLogsListPage() {
  return {
    logsList: await getLogsList({}),
  }
}
export type FGetLogsListPage = typeof getLogsListPage;


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


export const getTableCustomPageData = methodFactory(({ }, { tableName }: ATableOnly, { db }) => {
  const t = db.getTable(tableName);
  return {
    scheme: t.scheme,
    meta: t.meta as any,
  }
});
export type FGetTableCustomPageData = typeof getTableCustomPageData;
export type RGetTableCustomPageData = Awaited<ReturnType<FGetTableCustomPageData>>;


import * as AdminValidators from "../../kurgandb_admin/validation";
import { ADMIN_VERSION } from "../generated";

export type RUpdateValidationPage = {
  invalidRecords: PlainObject[];
  currentValidator: ParsedFunction;
}

export type RGetTableValidation = RUpdateValidationPage & {
  adminValidator?: ParsedFunction;
  primaryKey: string;
}

export const getTableValidation = methodFactory(({ }, { tableName }: ATableOnly, { db, $ }) => {
  const t = db.getTable(tableName);
  return {
    currentValidator: t.getSavedValidator(),
    primaryKey: t.primaryKey,
    invalidRecords: t.filter($.invalid).limit(20).select($.light) as PlainObject[],
  }
}, ({ currentValidator, primaryKey, invalidRecords }, { tableName }) => {
  // const evs = (AdminEvents as any)[tableName] || {};
  let adminValidator: undefined | ParsedFunction;
  const fn = (AdminValidators as any)[tableName];
  if (fn) {
    adminValidator = parseFunction(fn);
  }

  const result: RGetTableValidation = {
    invalidRecords,
    adminValidator,
    currentValidator,
    primaryKey,
  }
  return result;
});

export type FGetTableValidation = typeof getTableValidation;


export const setCurrentTableValidator = async ({ tableName }: ATableOnly): Promise<RUpdateValidationPage> => {
  const fn = (AdminValidators as any)[tableName];
  if (!fn) {
    throw new ResponseError("Validator for table {...} doesn't exist", [tableName]);
  }

  return await query(({ }, { tableName, fun }, { db, $ }) => {
    const t = db.getTable(tableName);
    t.setValidator(fun);
    // return t.getSavedValidator();
    return {
      currentValidator: t.getSavedValidator(),
      invalidRecords: t.filter($.invalid).limit(20).select($.light) as PlainObject[],
    }
  }, {
    tableName,
    fun: parseFunction(fn),
  });
}

export type FSetCurrentTableValidator = typeof setCurrentTableValidator;


export const unsetCurrentTableValidator = methodFactory(({ }, { tableName }: ATableOnly, { db, $ }): RUpdateValidationPage => {
  const t = db.getTable(tableName);
  t.setValidator();
  return {
    currentValidator: t.getSavedValidator(),
    invalidRecords: t.filter($.invalid).limit(20).select($.light) as PlainObject[],
  }
});

export type FUnsetCurrentTableValidator = typeof unsetCurrentTableValidator;


export const getInvalidRecords = methodFactory(({ }, { tableName }: ATableOnly, { db, $ }) => {
  const t = db.getTable(tableName);
  return t.filter($.invalid).limit(20).select($.light) as PlainObject[]
});

export type FGetInvalidRecords = typeof getInvalidRecords;


export type RGetPlugins = {
  registeredPlugins: Record<string, ParsedFunction>;
  adminPlugins: string[];
}
import * as Plugins from "../../kurgandb_admin/plugins";
import { object } from "zod";
import { getPrismaClient, getPrismaHelper, getPrismaModels } from "../prisma";
import { getPrimaryKeyFromScheme } from "../globals";
export const getPlugins = methodFactory<{}, Record<string, ParsedFunction>, RGetPlugins>(({ }, { }, { db }) => {
  return db.getPlugins();
}, (registeredPlugins) => {
  return {
    registeredPlugins,
    adminPlugins: Object.keys(Plugins),
  }
});
export type FGetPlugins = () => Promise<RGetPlugins>

export type PluginDef = {
  npm: string[],
  install: PluginFactory;
};

export async function togglePlugin({ pluginName }: ATogglePlugin) {
  let pluginFactory: undefined | ParsedFunction;
  let pluginDef: PluginDef | undefined = (Plugins as any)[pluginName];
  let dependencies: string[] = [];
  if (pluginDef) {
    dependencies = pluginDef.npm;
    pluginFactory = parseFunction(pluginDef.install);
  }
  return await query(async ({ }, { pluginName, pluginFactory, dependencies }, { db }) => {
    const registered = db.getPlugins()[pluginName];
    if (registered) {
      db.unregisterPlugin(pluginName);
      if (dependencies.length) {
        await db.npmUninstall(dependencies.join(" "));
      }
    } else if (pluginFactory) {
      if (dependencies.length) {
        await db.npmInstall(dependencies.join(" "));
      }
      await db.registerPlugin(pluginName, pluginFactory);
    }
    return db.getPlugins();
  }, { pluginName, pluginFactory, dependencies });
}

export type FTogglePlugin = typeof togglePlugin;
