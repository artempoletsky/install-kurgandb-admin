
import { TableComponentProps } from "../../../app/adminroute/globals";
import { Button } from "@mantine/core"
import TableMeta from "./TableMeta";



export default function CustomComponentTable({ meta }: TableComponentProps) {

  return (
    <div className="">
      <TableMeta meta={meta}></TableMeta>
      <p className="text-red-900 mb-3">Customize table editing by modifying /app/kurgandb_admin/components/CustomComponentTable.tsx</p>
      <Button>Got it!</Button>
    </div>
  );
}