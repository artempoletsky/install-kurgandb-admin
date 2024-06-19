import { FieldTag, TableScheme } from "@artempoletsky/kurgandb/globals";
import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";

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



export function getPrismaScheme(): Record<string, TableScheme> {
  const result: Record<string, TableScheme> = {};

  const models = (prisma as any)._runtimeDataModel.models;
  for (const name in models) {
    const fields: PrismaField[] = models[name].fields;
    // console.log(models[name]);

    // console.log(models[name]);
    const kurganFields: Record<string, any> = {};
    const kurganTags: Record<string, FieldTag[]> = {};
    for (const f of fields) {
      kurganFields[f.name] = f.type;
      const tags: FieldTag[] = kurganTags[f.name] = [];
      if (f.isId) {
        tags.push("primary");
      }
    }

    result[name.toLowerCase()] = {
      fields: kurganFields,
      fieldsOrder: Object.keys(kurganFields),
      fieldsOrderUser: Object.keys(kurganFields),
      settings: {},
      tags: kurganTags,
    }
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