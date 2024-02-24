
import { TableComponentProps } from "../../adminroute/globals";
import { Button } from "@mantine/core"



export default function ({ scheme }: TableComponentProps) {

  return (
    <div className="">
      <p className="text-red-900 mb-3">Customize table editing by modifying /app/kurgandb_admin/components/CustomComponentTable.tsx</p>
      <Button>Got it!</Button>
    </div>
  );
}