"use client";
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { BreadcrumbsArray } from "./comp/Breadcrumbs";
// import { BreadcrumbsArray } from "./layout";

export class Store {
  static setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbsArray | null>>;
  static setTableName: Dispatch<SetStateAction<string>>;
}

//  const BreadcrumbsContext = createContext<BreadcrumbsArray | null>(null);
//  const TableNameContext = createContext<string>("");

function useStore() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsArray | null>(null)
  const [tableName, setTableName] = useState("")
  Store.setBreadcrumbs = setBreadcrumbs;
  Store.setTableName = setTableName;
  return { breadcrumbs, tableName };
}

export const StoreContext = createContext<ReturnType<typeof useStore>>({
  breadcrumbs: null,
  tableName: "",
});

export type ChildrenProps = {
  children?: ReactNode;
}


export default function StoreProvider({ children }: ChildrenProps) {
  const store = useStore();
  return (<StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>);
}