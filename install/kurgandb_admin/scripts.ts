import { FieldType, PlainObject } from "@artempoletsky/kurgandb/globals";
import fs from "fs";
import generateDB from "./codegen/db/generate_db";
import generateCodeFile from "./codegen/generate";
import { queryUniversal as query } from "@artempoletsky/kurgandb";



export const NextRoutes = {
  async createNewPage(path: string, mainComponentName: string) {
    if (!path) {
      return "Specify a path for the Next router!"
    }
    if (!mainComponentName) {
      mainComponentName = "UnnamedPage";
    }

    const dirPath = process.cwd() + "/app/" + path;
    if (fs.existsSync(dirPath)) return "Already exists!";


    fs.mkdirSync(dirPath, { recursive: true });
    const variables = {
      $$PATH$$: path,
      $$COMP$$: mainComponentName,
    }

    const sourcePath = `${process.cwd()}/app/kurgandb_admin`;
    generateCodeFile(sourcePath + "/codegen/newpage/page.tsx.txt", dirPath + "/page.tsx", variables);
    generateCodeFile(sourcePath + "/codegen/newpage/UnnamedPage.tsx.txt", dirPath + `/${mainComponentName}.tsx`, variables);

    this.createNewAPI(path + "/api");
  },

  async createNewAPI(path: string) {
    const dirPath = process.cwd() + "/app/" + path;
    if (fs.existsSync(dirPath)) return "Already exists!";

    fs.mkdirSync(dirPath, { recursive: true });

    const sourcePath = `${process.cwd()}/app/kurgandb_admin`;

    generateCodeFile(sourcePath + "/codegen/newpage/api/route.ts.txt", dirPath + "/route.ts", {});
    generateCodeFile(sourcePath + "/codegen/newpage/api/schemas.ts.txt", dirPath + "/schemas.ts", {});
    generateCodeFile(sourcePath + "/codegen/newpage/api/methods.ts.txt", dirPath + "/methods.ts", {});

    return "Success!";
  },
}
export const projectSetup = {
  async generateGlobalsAndDB_Files() {
    // Generate globals.ts and db.ts according to your database structure

    return await generateDB();
  },
  async createUsersTable() {
    // Create an example table named `users` with predefined fields

    const tableName = "users";
    
    const result = await query(({ }, { tableName }, { db }) => {
      if (db.doesTableExist(tableName)) {
        return "Table already exists";
      }
      db.createTable({
        name: tableName,
        fields: {
          username: "string",
          password: "string",
          isAdmin: "boolean",
          about: "string",
        },
        tags: {
          username: ["primary"],
          password: ["hidden"],
          about: ["hidden", "heavy", "textarea"],
          isAdmin: [],
        }
      });
      return "created";
    }, { tableName });
    return result;
  },
}

export const misc = {

  async ThrowError(message: string) {
    // Throw an error in the database with your message, you will see the error in the logs
    try {
      await query(({ }, { message }, { }) => {
        throw new Error(message);
      }, {
        message
      });
    } catch (err: any) {
      return err.message;
    }
  },
  async printHelloWithYourArguments(argument1: string, argument2: string) {
    // You can add a descrition with the comment

    return `Hello world! ${argument1} ${argument2} `;
  },
}
