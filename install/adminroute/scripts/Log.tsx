import { useEffect, useRef } from "react"

type Props = {
  log: string[]
}

export default function Log({ log }: Props) {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const cont = scrollContainerRef.current;
    if (!cont) throw new Error("container is undefined");
    cont.scrollTo(0, cont.scrollHeight);
  }, [log.length, log]);

  return <div className="mt-3">
    <p className="mb-3">Output:</p>
    <ul ref={scrollContainerRef} className="overflow-y-scroll max-w-[750px] h-[150px] bg-slate-700 text-gray-300 rounded">
      {log.map((str, i) => <li key={i}>{str}</li>)}
    </ul>
  </div>
}