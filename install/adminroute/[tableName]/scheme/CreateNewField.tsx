import { Button, Checkbox, Select, Tooltip } from "@mantine/core";
import TextInput from "../../comp/TextInput";
import { ValiationErrorResponce } from "@artempoletsky/easyrpc/client";
import { AAddField } from "../../api/route";
import { useState } from "react";
import { FieldType, FieldTypes } from "@artempoletsky/kurgandb/globals";

type Props = {
  requestError?: ValiationErrorResponce
  onAddField: (args: AAddField) => void
  tableName: string
};

export default function CreateNewField(props: Props) {
  const { requestError, onAddField, tableName } = props;
  const [fieldName, setFieldName] = useState("");
  const [type, setFieldType] = useState<FieldType>("string");
  const [isHeavy, setIsHeavy] = useState(false);

  return <div className="mt-3">
    <p className="mb-1">Add a new field:</p>
    <div className="flex gap-1 border-b border-slate-800">
      <TextInput
        error={requestError?.invalidFields.fieldName?.userMessage}
        placeholder="field name" value={fieldName}
        onChange={e => setFieldName(e.target.value)}
      />
      <Select value={type} data={FieldTypes} onChange={e => setFieldType(e as FieldType)} />
      <Tooltip label="Store this field as a separate file on each record">
        <div className="pt-2 mr-2">
          <Checkbox
            checked={isHeavy}
            onChange={e=> setIsHeavy(e.target.checked)}
            classNames={{
              label: "cursor-help",
              input: "cursor-help",
            }}
            label="heavy"
          />
        </div>
      </Tooltip>
      <Button onClick={e => onAddField({
        fieldName,
        tableName,
        type,
        isHeavy,
      })}>Add</Button>
    </div>
  </div>
}