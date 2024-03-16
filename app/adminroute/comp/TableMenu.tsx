"use client";

import { fetchCatch, getAPIMethod } from "@artempoletsky/easyrpc/client";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import Link from "next/link";
import { API_ENDPOINT, ROOT_PATH } from "../generated";
import type { FRemoveTable } from "../api/methods";

import { AirBalloon, Alarm, Asset, Edit, FileDatabase, Trash, ZoomExclamation } from 'tabler-icons-react';
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

const removeTable = getAPIMethod<FRemoveTable>(API_ENDPOINT, "removeTable");

type Props = {
  tableName: string
}

type Item = {
  label: string
  icon: ReactNode
  href: string
}


export default function TableMenu({ tableName }: Props) {


  const Items: Item[] = [
    {
      label: "Edit documents",
      icon: <FileDatabase />,
      href: `/${ROOT_PATH}/${tableName}`,
    },
    {
      label: "Edit scheme",
      icon: <Edit />,
      href: `/${ROOT_PATH}/${tableName}/scheme`,
    },
    {
      label: "Browse events",
      icon: <Alarm />,
      href: `/${ROOT_PATH}/${tableName}/events`,
    },
    {
      label: "Validation rules",
      icon: <ZoomExclamation />,
      href: `/${ROOT_PATH}/${tableName}/validation`,
    },
    {
      label: "Custom",
      icon: <Asset />,
      href: `/${ROOT_PATH}/${tableName}/custom`,
    },
  ];


  const router = useRouter();
  const doConfirmRemoveTable = fetchCatch(removeTable)
    .before(() => {
      const delStr = prompt(`Type '${tableName}' to confirm removing this table`);
      if (delStr != tableName) return;
      return { tableName };
    })
    .then(() => { router.replace(`/${ROOT_PATH}/`); }).action();

  return <div className="flex gap-3">
    {Items.map(e => (
      <Tooltip key={e.href} label={e.label}>
        <Link href={e.href}><ActionIcon size={36}>{e.icon}</ActionIcon></Link>
      </Tooltip>
    ))}
    <div className="grow"></div>
    <Tooltip key="remove" label="Remove table">
      <ActionIcon onClick={doConfirmRemoveTable} size={36}><Trash /></ActionIcon>
    </Tooltip>
  </div>
}