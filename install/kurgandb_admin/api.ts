
import { ValidationRule } from "@artempoletsky/easyrpc";


type AExapleCustomMethod = {
  arg: string
}

const VExapleCustomMethod: ValidationRule<AExapleCustomMethod> = {
  arg: "stringEmpty",
}

async function exampleCustomMethod({ arg }: AExapleCustomMethod) {
  return arg.split("").reverse().join("");
}

export type FExapleCustomMethod = typeof exampleCustomMethod;

//////////////////////////////////////////////////////////////////////////


export const customRules = {
  exampleCustomMethod: VExapleCustomMethod,
};

export const customAPI = {
  exampleCustomMethod,
}