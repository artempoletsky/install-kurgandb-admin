"use client";

import { getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";
import { ComponentType, ElementType, ReactElement, ReactNode, useEffect, useState } from "react";
import { FGetTableEvents } from "../api/methods";
import { API_ENDPOINT } from "../generated";
import RequestError from "./RequestError";
import { Loader } from "@mantine/core";



type Props<AT, RT, PT> = {
  method: (arg: AT) => Promise<RT>;
  Component: ComponentType<RT & AT & PT>;
  args: AT;
  props?: PT;
  children?: ReactNode;
  onData?: (res: RT) => void;
}

export default function ComponentLoader
  <AT, RT, PT>
  ({ Component, children, args, method: methodHack, props, onData }: Props<AT, RT, PT>) {
  const methodName = methodHack as unknown as string;

  const _props: PT = props || {} as PT;
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();
  const method = getAPIMethod<(arg: AT) => Promise<RT>>(API_ENDPOINT, methodName);

  const [data, setData] = useState<RT>();
  useEffect(() => {
    method(args).then(res => {
      setData(res);
      if (onData) onData(res);
    }).catch(setErrorResponse);
  }, [args]);

  if (!data && !errorResponse) {
    if (children) return children;
    return <Loader type="dots" />
  }
  if (data) return <Component {...data} {...args} {..._props} ></Component>;

  return <RequestError requestError={errorResponse}></RequestError>;
}

