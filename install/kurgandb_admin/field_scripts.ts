
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FExapleCustomMethod } from "./api";
import { API_ENDPOINT } from "../adminroute/generated";
import { FieldScriptsObject } from "../adminroute/globals";


const exampleCustomMethod = getAPIMethod<FExapleCustomMethod>(API_ENDPOINT, "exampleCustomMethod");


export const fieldScripts: FieldScriptsObject = {
  users: { // the name of the table
    username: { // the name of the field
      reverse({ value, input }) {
        exampleCustomMethod({
          arg: value as string
        }).then(reversed => {
          input.value = reversed;
        })
      }
    }
  }
}
