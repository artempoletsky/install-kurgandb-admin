import { FetcherCatcher } from "@artempoletsky/easyrpc/react";
import { Button, Tooltip } from "@mantine/core";
import { useState } from "react";
import { blinkBoolean } from "../utils_client";


type Props<ReturnType, AType> = {
  fc: FetcherCatcher<ReturnType, AType, void>;
  then: (arg: ReturnType) => void;
}
export default function ButtonSave<ReturnType, AType>({ fc, then }: Props<ReturnType, AType>) {
  const [savedTooltip, setSavedTooltip] = useState(false);

  fc = fc.then(res => {
    blinkBoolean(setSavedTooltip);
    then(res);
  });

  return <Tooltip opened={savedTooltip} label="Saved!">
    <Button onClick={fc.action()}>Save</Button>
  </Tooltip>
}