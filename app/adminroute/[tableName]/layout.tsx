"use client";
import { ReactNode, useContext, useEffect } from "react";
import Breadcrumbs from "../comp/Breadcrumbs";
import { Store, useStore } from "../StoreProvider";

type Props = {
  children: ReactNode;
  params: {
    tableName: string;
  }
}
export default function layout({ params: { tableName }, children }: Props) {
  // const store = useStore();
  useEffect(() => {
    Store.setTableName(tableName);
  }, [tableName]);
  return children;
}