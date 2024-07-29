"use client";

import Link from "../comp/Link";
import { ROOT_PATH } from "../generated";
import { useStore, useStoreEffectSet } from "../store";


type Props = {
  tables: string[]
}
export default function PageTables({ tables }: Props) {
  useStoreEffectSet("tableName", "");
  useStoreEffectSet("tableScheme", null);
  if (!tables.length) return "No tables created yet";
  return <ul>
    {tables.map(id => <li className="mb-1" key={id}><Link href={`/${ROOT_PATH}/${id}/records/`}>{id}</Link></li>)}
  </ul>
}