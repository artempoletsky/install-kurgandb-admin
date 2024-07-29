import { RequestErrorSetter } from "@artempoletsky/easyrpc/client";
import { fetchCatch } from "@artempoletsky/easyrpc/react";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import { Button } from "@mantine/core";
import { adminRPC, deepClone } from "../../globals";
import { EditDocumentFormProps } from "./EditDocumentForm";
import ButtonSave from "../../comp/ButtonSave";
import { Store } from "../../store";

const {
  updateDocument,
  createDocument,
  deleteDocument,
} = adminRPC().methods("updateDocument", "createDocument", "deleteDocument");

type Props = {
  record: PlainObject;
  initialRecord: PlainObject;
  recordId: string | number | undefined;
  onCreated: (id: string | number) => void;
  onDeleted: () => void;
  onDuplicate: () => void;
  onUpdate: (newRecord: PlainObject) => void;
}
export default function CRUDButtons({
  record,
  initialRecord,
  onCreated,
  recordId,
  onDeleted,
  onDuplicate,
  onUpdate,
}: Props) {

  const insertMode = recordId === undefined;

  const fc = fetchCatch().catch(Store.onRequestError);
  const tableName = Store.tableName;

  const create = fc.method(createDocument).before(() => ({
    tableName,
    document: record,
  })).then(onCreated).action();

  const remove = fc.method(deleteDocument).before(() => {
    return {
      tableName,
      id: recordId!,
    }
  }).confirm(async () => {
    return confirm("Are you sure you want delete this document?");
  }).then(onDeleted).action();


  const fcSave = fc.method(updateDocument).before(() => ({
    tableName,
    id: recordId!,
    document: record,
  }));

  if (insertMode) return <div className="mt-3"><Button onClick={create}>Create</Button></div>;

  return <div className="flex gap-1 mt-3">
    {/* <Tooltip opened={savedTooltip} label="Saved!">
      <Button onClick={save}>Save</Button>
    </Tooltip> */}
    <ButtonSave fc={fcSave} then={() => {
      onUpdate(record);
    }} />
    <Button onClick={remove}>Remove</Button>
    <Button onClick={onDuplicate}>Duplicate</Button>
    <Button onClick={() => onUpdate(deepClone(initialRecord))}>Reset</Button>
  </div>
}