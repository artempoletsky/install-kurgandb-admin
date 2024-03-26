"use client";
import { ReactNode, useContext } from "react";
import Breadcrumbs from "../comp/Breadcrumbs";
import { Store, StoreContext } from "../StoreProvider";

type Props = {
  children: ReactNode;
  params: {
    tableName: string;
  }
}
export default function layout({ params: { tableName }, children }: Props) {
  const store = useContext(StoreContext);
  Store.setTableName(tableName);
  return <div>
    <Breadcrumbs crumbs={store.breadcrumbs} />
    {children}
  </div>;
}