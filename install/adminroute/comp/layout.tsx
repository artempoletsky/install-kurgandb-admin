import { Breadcrumbs,  MantineProvider } from "@mantine/core"
import Link from "next/link";
import { ReactNode } from "react"
import { ROOT_PATH } from "../generated";
import '@mantine/core/styles.css';

export type BreadrumbsArray = { title: string, href: string }[];



export default function Layout({
  children,
  breadcrumbs
}: {
  children: ReactNode
  breadcrumbs?: BreadrumbsArray
}) {

  let items: ReactNode[] = [];
  if (breadcrumbs) {
    items = breadcrumbs.map((e, i) => e.href ? <Link key={i} href={`/${ROOT_PATH}/${e.href}`}>{e.title}</Link> : <b key={i}>{e.title}</b>)
  }
  
  return <MantineProvider><div className="pl-3 pt-3">
    {breadcrumbs && <Breadcrumbs>{items}</Breadcrumbs>}
    {children}
  </div></MantineProvider>
}