import { PluginFactory } from "@artempoletsky/kurgandb/globals";

export const myPlugin: PluginFactory = function name(scope) {

  return {
    myMethod() {
      return scope.db.versionString;
    }
  }
}

export type Plugins = {
  myPlugin: ReturnType<typeof myPlugin>;
}