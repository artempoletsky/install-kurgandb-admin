
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FExapleCustomMethod } from "./api";
import { API_ENDPOINT } from "../adminroute/generated";
import { FieldScriptsObject } from "../adminroute/globals";
import { encodePassword } from "@artempoletsky/kurgandb/globals";


const exampleCustomMethod = getAPIMethod<FExapleCustomMethod>(API_ENDPOINT, "exampleCustomMethod");

type UserFull = { username: string, password: string };
export const fieldScripts: FieldScriptsObject = {
  users: { // the name of the table
    username: { // the name of the field
      reverse(record: UserFull) {
        exampleCustomMethod({
          arg: record.username
        }).then(reversed => {
          record.username = reversed;
        })
      },
      script() {

      },
    },
    password: {
      encode(record: UserFull) {
        record.password = encodePassword(record.password);
      }
    }
  }
}
