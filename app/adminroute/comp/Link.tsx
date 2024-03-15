import NextLink, { LinkProps } from "next/link";
import { ReactNode } from "react";
import css from "../admin.module.css";

export default function Link(props: LinkProps & { className?: string, children: ReactNode }) {

  let className = props.className || "";
  return <a href={props.href.toString()} className={className + " " + css.link}>{props.children}</a>
}