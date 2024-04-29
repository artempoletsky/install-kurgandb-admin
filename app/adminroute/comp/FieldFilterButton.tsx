import { ActionIcon, Menu } from "@mantine/core";
import { Filter } from "tabler-icons-react";
import { Store, useStore } from "../StoreProvider";
import { MouseEvent } from "react";

type Props = {
  fieldName: string;
  value: any;
};


export default function FieldFilterButton({ fieldName, value }: Props) {
  const valueStr = typeof value == "string" ? `"${value}"` : `${value}`;
  const { queryString } = useStore();
  const handleClick = (add: string) => (e: MouseEvent) => {
    let result = "t" + add;
    if (e.shiftKey) {
      result = queryString + add;
    }
    Store.setQueryString(result);
  }

  const prevent = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  return <Menu>
    <Menu.Target>
      <ActionIcon
        onMouseDown={prevent}
        onMouseUp={prevent}
        onClick={prevent}
        className="bg-stone-400 mr-1"
        size="xs"
      ><Filter /></ActionIcon >
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item onClick={handleClick(`.where("${fieldName}",${valueStr})`)}>Exact</Menu.Item>
      <Menu.Item onClick={handleClick(`t.where("${fieldName}",v=>v.includes(${valueStr}))`)}>Includes</Menu.Item>
      <Menu.Item onClick={handleClick(`t.where("${fieldName}",v=>v.startsWith(${valueStr}))`)}>Starts with</Menu.Item>
    </Menu.Dropdown>
  </Menu>
}