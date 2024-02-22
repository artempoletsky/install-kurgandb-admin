"use client";

import { useState } from "react";
import TextInput from "./TextInput";
import { Button } from "@mantine/core";
import { ValiationErrorResponce, getAPIMethod } from "@artempoletsky/easyrpc/client";
import { FAuthorize } from "../api/route";
import { API_ENDPOINT } from "../generated";

const authorize = getAPIMethod<FAuthorize>(API_ENDPOINT, "authorize");

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);

  let [requestError, setRequestError] = useState<ValiationErrorResponce | undefined>(undefined);

  function onAutorize() {
    setIncorrect(false);
    setRequestError(undefined);
    authorize({ userName, password })
      .then((success) => {
        setIncorrect(!success);

        if (success) window.location.href += "";
      })
      .catch(setRequestError);
  }
  return <div className="h-screen bg-stone-200 flex items-center">
    <div className="mx-auto w-[350px] h-[250px]">
      <p className="mb-1">Authorization is required</p>
      <TextInput
        error={requestError?.invalidFields.userName?.userMessage}
        value={userName} onChange={e => setUserName(e.target.value)} placeholder="username" />
      <TextInput
        error={requestError?.invalidFields.password?.userMessage}
        value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
      <Button onClick={onAutorize}>Login</Button>
      {incorrect &&
        <div className="text-red-900">Incorrect username or password</div>
      }
    </div>
  </div>
}