import Link from "next/link";
import css from "./paginator.module.css";

type Props = {
  page: number
  pagesCount: number
  span?: number
  onSetPage?: (page: number) => void
}

type PaginatorElement = {
  type: "page" | "gap" | "link"
  content: string
  link: string
  key: number
  page?: number
}
export default function Paginator({ page, pagesCount, span, onSetPage }: Props) {
  const elems: PaginatorElement[] = [];
  if (span === undefined) {
    span = 5;
  }
  let gapEnded = true;
  for (let i = 1; i <= pagesCount; i++) {
    if (Math.abs(i - page) < span || Math.abs(i - 1) < span || Math.abs(i - pagesCount) < span) {
      const el: PaginatorElement =
        i == page
          ? {
            key: i,
            type: "page",
            link: "",
            content: page + "",
            page: undefined,
          }
          : {
            key: i,
            type: "link",
            link: `./${i}`,
            content: i + "",
            page: i,
          };
      elems.push(el);
      gapEnded = true;
    } else {
      if (gapEnded) {
        elems.push({
          key: i,
          type: "gap",
          link: "",
          content: "...",
          page: undefined,
        });
        gapEnded = false;
      }
    }
  }
  return <ul className="flex">
    {elems.map(el => <li key={el.key}>
      {el.link
        ? <a href="#" onClick={e => {
          e.preventDefault();
          if (onSetPage)
            onSetPage(el.page as number);
        }} className={css.element}>{el.content}</a>
        : <span className={css.element + (el.type == "gap" ? "" : " font-bold")}>{el.content}</span>
      }
    </li>)}
  </ul>
}