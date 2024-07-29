import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
}
export default function Label({ children }: Props) {
  return <label className="block mb-1 text-lg font-semibold mt-3">{children}</label>
}