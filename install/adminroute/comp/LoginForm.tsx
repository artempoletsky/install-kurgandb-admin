"use client";

import TextInput from "./TextInput";
import { Button } from "@mantine/core";
import { useErrorResponse } from "@artempoletsky/easyrpc/react";

import { useForm, zodResolver } from '@mantine/form';
import { AAuthorize, authorize as ZAuthorize } from "../api/schemas";
import { adminRPC } from "../globals";

const authorize = adminRPC().method("authorize");

export default function LoginForm() {
  // const [incorrect, setIncorrect] = useState(false);

  const form = useForm<AAuthorize>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: zodResolver(ZAuthorize),
  });

  const [setRequestError, mainErrorMessage] = useErrorResponse(form)

  function onAutorize({ userName, password }: AAuthorize) {
    setRequestError();
    authorize({ userName, password })
      .then(() => {
        window.location.href += "";
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
      <div className="text-red-900 min-h-[25px]">{mainErrorMessage}</div>
    </form>
  </div>
}