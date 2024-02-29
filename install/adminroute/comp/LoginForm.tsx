"use client";

import { useState } from "react";
import TextInput from "./TextInput";
import { Button } from "@mantine/core";
import { getAPIMethod, useMantineRequestError } from "@artempoletsky/easyrpc/client";
import { FAuthorize } from "../api/route";
import { API_ENDPOINT } from "../generated";

import { zodResolver } from 'mantine-form-zod-resolver';
import z from 'zod';
import { useForm } from '@mantine/form';
import { AAuthorize, authorize as ZAuthorize } from "../api/schemas";

const authorize = getAPIMethod<FAuthorize>(API_ENDPOINT, "authorize");


export default function LoginForm() {
  const [incorrect, setIncorrect] = useState(false);

  const form = useForm<AAuthorize>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: zodResolver(ZAuthorize),
  });

  const setRequestError = useMantineRequestError(form);

  function onAutorize({ userName, password }: AAuthorize) {
    setIncorrect(false);
    setRequestError();
    authorize({ userName, password })
      .then((success) => {
        setIncorrect(!success);
        if (success) window.location.href += "";
      })
      .catch(setRequestError);
  }


  return <div className="h-screen bg-stone-200 flex items-center">
    <form className="mx-auto w-[350px] h-[250px]" onSubmit={form.onSubmit(onAutorize)} action="#" autoComplete="off">
      <p className="mb-1">Authorization is required</p>
      <TextInput
        {...form.getInputProps("userName")}
        // error={requestError?.invalidFields.userName?.userMessage}
        placeholder="username"
      />
      <TextInput
        {...form.getInputProps("password")}
        // error={requestError?.invalidFields.password?.userMessage}
        placeholder="password" type="password" />
      <Button type="submit">Login</Button>
      {incorrect &&
        <div className="text-red-900">Incorrect username or password</div>
      }
    </form>
  </div>
}