import { ResponseError } from "@artempoletsky/easyrpc";
import { FieldTag, FieldType, TableScheme } from "@artempoletsky/kurgandb/globals";
// import { Prisma, PrismaClient } from "@prisma/client";
import { getPrimaryKeyFromScheme } from "../globals";
import { DB_TYPE } from "../generated";

let PrismaClient;
// console.log(DB_TYPE);
if (DB_TYPE != "prisma") {
  throw new Error("Prisma DB type is expected!");
}else {
  PrismaClient = eval(`require("@prisma/client").PrismaClient`);
}

const prisma = new PrismaClient();

export type PrismaField = {
  name: string;
  kind: string;
  isList: boolean;
  isRequired: boolean;
  isUnique: boolean;
  isId: boolean;
  isReadOnly: boolean;
  hasDefaultValue: boolean;
  type: string;
  default?: any;
  isGenerated: boolean;
  isUpdatedAt: boolean;

  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
}

export interface PrismaTable {
  create(arg: any): Promise<any>;
  findUnique(arg: any): Promise<any>;
  update(arg: any): Promise<void>;
  findMany(arg: any): Promise<any[]>;
  count(): Promise<number>;
  delete(arg: any): Promise<any>;
}

export type PrismaSchema = {
  tables: PrismaTable;
}

// wraps all prisma methods 
async function prismaMethodProxy(table: PrismaTable, method: keyof PrismaTable, args: any) {
  try {
    return await table[method].apply(table, args);
  } catch (err: any) {
    throw new ResponseError({
      message: "Prisma error: " + err.message,
      statusCode: 400,
    });
  }
}


export class KDBQueryBuilder {
  private h: PrismaTableHelper;
  private whereFields: Record<string, any>;
  constructor(prismaHelper: PrismaTableHelper) {
    this.h = prismaHelper;
    this.whereFields = {};
  }

  all() {
    this.whereFields = {};
    return this;
  }

  where(key: string, value: any) {
    this.whereFields[key] = value;
    return this;
  }

  build() {
    return this.h.table.findMany({
      where: this.whereFields,
    });
  }
}

function getDefaultValueForType(type: FieldType) {
  if (type == "date") {
    return new Date();
  } else if (type == "boolean") {
    return false;
  } else if (type == "number") {
    return 0;
  } else if (type == "json") {
    return null;
  } else if (type == "string") {
    return "";
  }
  throw new Error("wrong type");
}
export class PrismaTableHelper {
  public readonly primaryKey: string;
  public readonly tableName: string;
  public readonly fields: PrismaField[];
  public readonly table: PrismaTable;
  public readonly kdbScheme: TableScheme;
  private kdbQueryBuilder: KDBQueryBuilder;
  constructor(tableName: string, scheme: TableScheme, fields: PrismaField[]) {
    this.table = new Proxy((prisma as any)[tableName], {
      get(target, key: string) {
        if (typeof target[key] == "function") {
          return (...args: any[]) => {
            return prismaMethodProxy(target, key as any, args);
          }
        }
        return target[key];
      }
    });
    this.tableName = tableName;
    this.kdbScheme = scheme;
    this.primaryKey = getPrimaryKeyFromScheme(scheme);
    this.fields = fields;
    this.kdbQueryBuilder = new KDBQueryBuilder(this);
  }

  getDraft() {
    const result: Record<string, any> = {};


    for (const f of this.fields) {
      const type = this.kdbScheme.fields[f.name];
      if (!type) continue;

      const tags = new Set(this.kdbScheme.tags[f.name]);
      if (tags.has("autoinc")) continue;

      if (f.default !== undefined && type != "date") {
        result[f.name] = type == "json" ? JSON.parse(f.default) : f.default;
        // console.log(f.default);
      } else {
        result[f.name] = getDefaultValueForType(type);
      }
    }
    return result;
  }

  getFreeId() {
    const primaryKeyType = this.kdbScheme.fields[this.primaryKey];
    if (primaryKeyType == "number") return 0;
    return "";
  }

  async kdbQuery<PrimaryKeyType>(query: string): Promise<PrimaryKeyType[]> {
    let table = this.kdbQueryBuilder;
    let t = table;
    t.all();
    eval(query);
    return (await table.build()).map((o) => o[this.primaryKey]);
  }
}

const helpers: Record<string, PrismaTableHelper> = {};
export function getPrismaHelper(tableName: string) {
  const helper = helpers[tableName];
  if (!helper) throw ResponseError.notFound("Table {{}} not found", [tableName]);
  return helper;
}

export function prismaTypeToKDBType(type: string): FieldType {
  switch (type) {
    case "DateTime": return "date";
    case "Int": return "number";
    case "String": return "string";
    case "Boolean": return "boolean";
  }
  return "json";
}

function init(): Record<string, TableScheme> {
  const result: Record<string, TableScheme> = {};

  const models = (prisma as any)._runtimeDataModel.models;
  for (const name in models) {
    const fields: PrismaField[] = models[name].fields;
    // console.log(models[name]);

    // console.log(models[name]);
    const kurganFields: Record<string, any> = {};
    const kurganTags: Record<string, FieldTag[]> = {};
    for (const f of fields) {
      if (f.relationName || f.relationFromFields || f.relationToFields) continue;
      kurganFields[f.name] = prismaTypeToKDBType(f.type);
      const tags: FieldTag[] = kurganTags[f.name] = [];
      if (f.isId) {
        tags.push("primary");
      }

      if (f.default && f.default.name == "autoincrement") {
        tags.push("autoinc");
      }
    }

    const s = {
      fields: kurganFields,
      fieldsOrder: Object.keys(kurganFields),
      fieldsOrderUser: Object.keys(kurganFields),
      settings: {},
      tags: kurganTags,
    };

    const lName = name.charAt(0).toLowerCase() + name.slice(1);
    result[lName] = s;
    helpers[lName] = new PrismaTableHelper(lName, s, fields);

  }
  // console.log();

  // const fields = prisma.user.f
  // const tables = getPrismaModels();
  // const table:Prisma.UserDelegate = prisma.user;
  // for (const key of tables) {
  //   prisma[key].fields;
  // }
  // console.dir(prisma);
  return result;
}

export function getPrismaModels() {
  const result: string[] = [];
  for (const key in prisma) {
    if (key.startsWith("_") || key.startsWith("$")) continue;
    result.push(key);
  }
  return result;
}

export function getPrismaClient() {
  return prisma;
}

init();