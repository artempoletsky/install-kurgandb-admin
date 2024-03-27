import { CallbackScope } from "@artempoletsky/kurgandb";

export const myPlugin = function name(scope: CallbackScope) {

  return {
    myMethod() {
      return scope.db.versionString;
    }
  }
}

export type Plugins = {
  myPlugin: ReturnType<typeof myPlugin>;
}