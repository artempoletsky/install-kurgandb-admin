"use client";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { BreadcrumbsArray } from "./comp/Breadcrumbs";
// import { BreadcrumbsArray } from "./layout";

export class Store {
  static setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbsArray | null>>;
  static setTableName: Dispatch<SetStateAction<string>>;
  static setQueryString: Dispatch<SetStateAction<string>>;
}

export function useStore() {
  return useContext(StoreContext);
}

function createStore() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsArray | null>(null)
  const [tableName, setTableName] = useState("")
  const [queryString, setQueryString] = useState("table.all()")
  Store.setBreadcrumbs = setBreadcrumbs;
  Store.setTableName = setTableName;
  Store.setQueryString = setQueryString;
  return { breadcrumbs, tableName, queryString };
}

const StoreContext = createContext<ReturnType<typeof createStore>>({
  breadcrumbs: null,
  tableName: "",
  queryString: "table.all()",
});

export type ChildrenProps = {
  children?: ReactNode;
}


export default function StoreProvider({ children }: ChildrenProps) {
  const store = createStore();
  return (<StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>);
}