
import { ActionIcon, Button, TextInput } from "@mantine/core";
import { ChangeEvent, ReactNode } from "react";
import { Minus, Plus } from "tabler-icons-react";
import z from "zod";


type Props<T = any> = {
  validatior?: z.ZodType<T>;
  value: Record<string, T> | null;
  onChange: (arg: Record<string, T>) => void;
  defaultValue: T;
}

type KeyValue<T = any> = {
  key: string;
  value: T;
}
export default function DictionaryEditor<T>({ value, onChange, validatior, defaultValue }: Props<T>) {
  const dict: Record<string, T> = value || {};

  const keyValue: KeyValue<T>[] = [];
  for (const key in dict) {
    keyValue.push({
      key,
      value: dict[key],
    });
  }

  function addItem() {
    let keyName = "new_key";
    let i = 0;
    while (keyName in dict) {
      keyName = "new_key_" + i++;
    }
    onChange({
      ...dict,
      [keyName]: defaultValue,
    });
  }

  const removeItem = (index: number) => () => {
    const key = keyValue[index].key;
    const newValue = { ...dict };
    delete newValue[key];
    onChange(newValue);
  }

  const changeKey = (oldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = dict[oldKey];
    const newKey = e.target.value;
    const newVal = { ...dict };
    delete newVal[oldKey];
    newVal[newKey] = val;
    onChange(newVal);
  }

  const changeValue = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...dict,
      [key]: e.target.value as T,
    });
  }

  const list: ReactNode[] = [];
  for (let i = 0; i < keyValue.length; i++) {
    const element = keyValue[i];
    list.push(<li key={i}
      className="flex gap-3 items-center"
    >
      <TextInput autoComplete="off" className="basis-1/2" value={element.key} onChange={changeKey(element.key)} />
      <TextInput autoComplete="off" className="basis-1/2" value={element.value as string} onChange={changeValue(element.key)} />
      <ActionIcon className="shrink" onClick={removeItem(i)}><Minus /></ActionIcon>
    </li>)
  }
  return <div className="mb-3 pb-3 border-b border-gray-700">
    <ul className="mb-3 flex flex-col gap-3">
      {list}
    </ul>
    <Button onClick={addItem} className="pl-[11px]"><Plus /> Add</Button>
  </div>
} 