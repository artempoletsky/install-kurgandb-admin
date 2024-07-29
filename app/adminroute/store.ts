"use client";
import { useStoreUntyped, createStore } from "@artempoletsky/easystore";
import type { BreadcrumbsArray } from "./comp/Breadcrumbs";
import { useEffect } from "react";
import { RequestErrorSetter } from "@artempoletsky/easyrpc/client";
import { TableScheme } from "@artempoletsky/kurgandb/globals";

export type Store = {
  breadcrumbs: BreadcrumbsArray | null;
  tableName: string;
  queryString: string;
  onRequestError: RequestErrorSetter;
  tableScheme: null | TableScheme;
};

export const Store = createStore<Store>({
  initialValues: {
    breadcrumbs: null,
    tableName: "",
    queryString: "table.all()",
    onRequestError: () => { },
    tableScheme: null,
  },
  useEffect() {
    
  }
});

export function useStore<KeyT extends keyof Store>(key: KeyT) {
  return useStoreUntyped<Store, KeyT>(key);
}

export function useStoreEffectSet<KeyT extends keyof Store>(key: KeyT, value: Store[KeyT]) {
  const [, dispatch] = useStore(key);
  useEffect(() => {
    dispatch(value);
  }, [value]);
}