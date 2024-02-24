import { DocumentComponentProps } from "../../adminroute/globals";
import { Button } from "@mantine/core";


export default function (params: DocumentComponentProps) {

  return (
    <div className="">
      <p className="text-red-900 max-w-[450px] mb-3">Customize records editing by modifying /app/kurgandb_admin/components/CustomComponentRecord.tsx</p>
      <Button>It's awesome!</Button>
    </div>
  );
}