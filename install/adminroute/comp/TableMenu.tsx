"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import { Button } from "@mantine/core";
import Link from "next/link";
import { API_ENDPOINT, ROOT_PATH } from "../generated";
import type { FRemoveTable } from "../api/route";


const removeTable = getAPIMethod<FRemoveTable>(API_ENDPOINT, "removeTable");

type Props = {
  tableName: string
}
export default function TableMenu({ tableName }: Props) {

  function confirmRemoveTable() {
    // setRequestError(undefined);

    const delStr = prompt(`Type '${tableName}' to confirm removing this table`);
    if (delStr != tableName) return;
    removeTable({
      tableName,
    })
      .then(() => {
        window.location.href = "./";
      })
      // .catch(setRequestError);
  }

  return <div className="flex gap-3 mt-5">
    <Link href={`/${ROOT_PATH}/${tableName}`}><Button>Edit documents</Button></Link>
    <Link href={`/${ROOT_PATH}/${tableName}/scheme`}><Button>Edit scheme</Button></Link>
    <Link href={`/${ROOT_PATH}/${tableName}/events`}><Button>Browse events</Button></Link>
    <Link href={`/${ROOT_PATH}/${tableName}/validation`}><Button>Validation rules</Button></Link>
    <Button onClick={confirmRemoveTable}>Remove table</Button>
  </div>
}