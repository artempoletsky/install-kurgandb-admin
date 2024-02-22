

import Layout, { BreadrumbsArray } from "../comp/layout";

import * as scriptsRaw from "../../kurgandb_admin/scripts";
import { PlainObject } from "../utils_client";
import { Button, TextInput } from "@mantine/core";
import { ReactNode } from "react";
import FunctionComponent from "./FunctionComponent";
import ScriptsPage, { Group, ParsedFunction } from "./ScriptsPage";



function parseFunction(f: Function): ParsedFunction | false {
  const str = f.toString();
  const matched = /\(([^\)]+)\)/.exec(str);
  // console.log(matched);
  let args: string[] = [];
  if (matched) {
    args = matched[1].replace(/\s/, "").split(",");
  }
  let description = "";
  const descMatched = /\{\s*\/\/([^\n]+)/.exec(str);
  if (descMatched) {
    description = descMatched[1];
  }

  return {
    args,
    description,
  }
}

function createGroup(scripts: PlainObject): Group {
  const result: Group = {};
  for (const key in scripts) {
    const value = scripts[key];
    if (typeof value == "function") {
      result[key] = {
        fun: parseFunction(value),
      }
    } else {
      result[key] = {
        children: createGroup(value),
      }
    }
  }
  return result;
}

const scripts: Group = createGroup(scriptsRaw);

export default async function () {

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: "", title: "Scripts" },
  ];


  return (
    <Layout breadcrumbs={crumbs}>
      <ScriptsPage scripts={scripts} />
    </Layout>
  );
}