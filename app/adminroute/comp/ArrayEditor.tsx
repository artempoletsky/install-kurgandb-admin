
import { ActionIcon, Button, TextInput } from "@mantine/core";
import { ReactNode } from "react";
import { Minus, Plus } from "tabler-icons-react";
import z from "zod";


type Props = {
  validatior?: z.ZodType;
  value: any[];
  onChange: (arg: any[]) => void;
}
export default function ArrayEditor({ value, onChange, validatior }: Props) {
  if (!value) value = [];
  function addItem() {
    let newArr = value.slice(0);
    newArr.push("");
    onChange(newArr);
  }

  const removeItem = (index: number) => () => {
    let newArr = value.slice(0);
    newArr.splice(index, 1);
    onChange(newArr);
  }

  const list: ReactNode[] = [];
  for (let i = 0; i < value.length; i++) {
    const element = value[i];
    list.push(<li key={i}
      className="flex gap-3 items-center"
    >
      <TextInput autoComplete="off" className="grow" value={element} onChange={e => {
        // value[i] = val
        let newArr = value.slice(0);
        let val = e.target.value;
        if (validatior) {
          val = validatior.parse(val);
        }
        newArr[i] = val;
        onChange(newArr);
      }} />
      <ActionIcon onClick={removeItem(i)}><Minus /></ActionIcon>
    </li>)
  }
  return <div className="mb-3 pb-3 border-b border-gray-700">
    <ul className="mb-3 flex flex-col gap-3">
      {list}
    </ul>
    <Button onClick={addItem} className="pl-[11px]"><Plus /> Add</Button>
  </div>
} 