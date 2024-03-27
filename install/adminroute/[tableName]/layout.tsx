"use client";
import { ReactNode, useContext } from "react";
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
  Store.setTableName(tableName);
  return <div>
    {/* <Breadcrumbs crumbs={store.breadcrumbs} /> */}
    {children}
  </div>;
}