import { ResponseError } from "@artempoletsky/easyrpc";
import { FieldTag, FieldType, TableScheme } from "@artempoletsky/kurgandb/globals";
import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";
import { getPrimaryKeyFromScheme } from "./globals";

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

export type PrismaTable = {
  name: string;
  fields: PrismaField[];
}

export type PrismaSchema = {
  tables: PrismaTable;
}

export class PrismaTableHelper {
  public readonly primaryKey: string;
  public readonly tableName: string;
  public readonly fields: PrismaField[];
  public readonly table: any;
  public readonly kdbScheme: TableScheme;
  constructor(tableName: string, scheme: TableScheme, fields: PrismaField[]) {
    this.table = (prisma as any)[tableName];
    this.tableName = tableName;
    this.kdbScheme = scheme;
    this.primaryKey = getPrimaryKeyFromScheme(scheme);
    this.fields = fields;
  }

  getDraft() {
    const result: Record<string, any> = {};

    for (const fieldName in this.kdbScheme.fields) {
      const type = this.kdbScheme.fields[fieldName];
      const tags = new Set(this.kdbScheme.tags[fieldName]);
      if (tags.has("autoinc")) continue;
      // console.log(type);
      let value: any = "";
      if (type == "date") {
        value = new Date();
      } else if (type == "boolean") {
        value = false;
      } else if (type == "number") {
        value = 0;
      } else if (type == "json") {
        value = null;
      }
      result[fieldName] = value;
    }
    return result;
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

    const lName = name.toLowerCase();
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