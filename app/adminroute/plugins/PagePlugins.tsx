"use client";

import css from "../admin.module.css";
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import { fetchCatch, useErrorResponse } from "@artempoletsky/easyrpc/react";

import { ReactNode, useEffect, useState } from "react";
import { API_ENDPOINT } from "../generated";
import type { FGetLog, FTogglePlugin, RGetPlugins } from "../api/methods";
import Paginator from "../comp/paginator";
import type { LogEntry } from "@artempoletsky/kurgandb/globals";
import { before } from "node:test";
import { Button } from "@mantine/core";
import { ParsedFunctionComponent } from "../comp/ParsedFunctionComponent";

const togglePlugin = getAPIMethod<FTogglePlugin>(API_ENDPOINT, "togglePlugin");


type Props = {
  plugins: string[];
};
export default function PagePlugins({ registeredPlugins: pluginsInitial, adminPlugins }: RGetPlugins) {

  const [plugins, setPlugins] = useState(pluginsInitial);
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();
  const fc = fetchCatch({
    method: togglePlugin,
    before(pluginName: string) {
      return {
        pluginName
      }
    },
    then: setPlugins,
    errorCatcher: setErrorResponse,
  });

  const confirmRemove = fc.confirm(async () => {
    return confirm("Are you sure you want to unregister this plugin?")
  })

  function isPluginActive(name: string) {
    return !!plugins[name];
  }

  const activePlugins: ReactNode[] = [];
  for (const name in plugins) {
    activePlugins.push(<ParsedFunctionComponent
      name={name}
      {...plugins[name]}
      onRemoveClick={confirmRemove.action(name)}
    />);
  }
  return (
    <div className="">
      <div className="flex mb-10">
        <div className={css.col_l}>
          <h2 className={css.h2}>Admin plugins:</h2>
          {adminPlugins.map(name => <div className="mb-2" key={name}>
            <Button
              className="w-[250px] mr-3"
              onClick={fc.action(name)}
            >{name}</Button> {isPluginActive(name) && <span className="text-green-800">Active</span>}
          </div>)}
        </div>
        <div className={css.col_r}>
          <h2 className={css.h2}>Active plugins:</h2>
          {activePlugins}
        </div>
      </div>
    </div>
  );
}