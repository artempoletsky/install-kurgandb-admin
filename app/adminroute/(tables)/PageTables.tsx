"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import Link from "../comp/Link";
import { API_ENDPOINT, ROOT_PATH } from "../generated";
import { useEffect, useState } from "react";
import type { FGetAllTables } from "../api/methods";
import { Store } from "../StoreProvider";

const getAllTables = getAPIMethod<FGetAllTables>(API_ENDPOINT, "getAllTables");

type Props = {
  tables: string[]
}
export default function PageTables({ tables }: Props) {
  Store.setTableName("");
  if (!tables.length) return "No tables created yet";
  return <ul>
    {tables.map(id => <li className="mb-1" key={id}><Link href={`/${ROOT_PATH}/${id}/records/`}>{id}</Link></li>)}
  </ul>
}