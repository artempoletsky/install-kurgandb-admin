import { ValiationErrorResponce } from "@artempoletsky/easyrpc/client"

type Props = {
  requestError?: ValiationErrorResponce
}

export default function RequestError({ requestError }: Props) {

  return <>
    {requestError && requestError.message !== "Bad request" && <div className="text-red-800">
      <p className="">Request failed:</p>
      <p className="">{requestError.message}</p>
    </div>}</>
}