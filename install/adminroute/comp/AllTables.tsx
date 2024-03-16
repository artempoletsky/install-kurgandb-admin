"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import Link from "./Link";
import { API_ENDPOINT, ROOT_PATH } from "../generated";
import { useEffect, useState } from "react";
import type { FGetAllTables } from "../api/methods";

const getAllTables = getAPIMethod<FGetAllTables>(API_ENDPOINT, "getAllTables");

export default function AllTables() {
  const [tables, setTables] = useState<string[] | undefined>();
  useEffect(() => {
    getAllTables({}).then(setTables);
  }, []);

  if (!tables) return "Loading...";
  if (!tables.length) return "No tables created yet";
  return <ul>
    {tables.map(id => <li className="mb-1" key={id}><Link href={`/${ROOT_PATH}/${id}/`}>{id}</Link></li>)}
  </ul>
}