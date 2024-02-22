"use client";

import { ReactNode, useState } from "react";
import FunctionComponent from "./FunctionComponent";
import Log from "./Log";



export type ParsedFunction = {
  description: string
  args: string[]
}

export type Group = {
  [key: string]: {
    fun?: ParsedFunction | false,
    children?: Group,
  }
}

type Props = {
  scripts: Group
}


function formatCamelCase(str: string) {
  let result = "";
  let i = 0;
  let lastCharLetter = false;
  let lastCharLowerCase = false;
  for (let char of str) {
    if (i == 0) {
      char = char.toUpperCase();
    }

    const currentCharNumber = char.match(/[0-9]/);
    if (lastCharLetter && currentCharNumber) {
      char = " " + char;
    }

    const currentCharCapital = char.match(/[A-Z]/);

    if (lastCharLowerCase && currentCharCapital) {
      char = " " + char;
    }

    result += char;
    i++;
    lastCharLetter = !currentCharNumber;
    lastCharLowerCase = !currentCharCapital;
  }

  return result;
}

export default function ScriptsPage({ scripts }: Props) {

  const [log, setLog] = useState<string[]>([]);
  function onScriptExecuted(output: string) {
    if (output) {
      setLog([...log, output]);
    }
  }

  function printGroup(group: Group, path: string, key: string) {
    const items: ReactNode[] = [];


    for (const key in group) {
      const item = group[key];
      const newPath = `${path}.${key}`;

      if (item.children) {
        items.push(printGroup(item.children, newPath, key));
      } else {
        if (item.fun) {
          items.push(<FunctionComponent onExecuted={onScriptExecuted} className="mb-3" key={newPath} {...item.fun} path={newPath} name={formatCamelCase(key)} />);
        } else {
          items.push(<div key={newPath} className="mb-3 text-red-600">Failed to parse function: '{newPath}'</div>);
        }
      }
    }
    return <div key={path} className="pl-4 pb-2 mb-2 border-l-2 border-gray-500">
      {key && <label className="px-4 inline-block mb-3 border-b border-gray-500 relative left-[-16px]">{formatCamelCase(key)}</label>}
      <div className="">{items}</div>
    </div>
  }
  return <div>
    {printGroup(scripts, "scripts", "")}
    <Log log={log} />
  </div>
}