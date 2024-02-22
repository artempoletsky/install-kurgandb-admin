import { Button } from "@mantine/core";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { ROOT_PATH } from "../generated";



export default function Header() {

  return <div className="absolute top-5 right-5 flex gap-3">
    <Link href={`/${ROOT_PATH}/scripts`}><Button>Scripts</Button></Link>
    <LogoutButton />
  </div>
}