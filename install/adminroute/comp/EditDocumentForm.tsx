"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";

// import Button from "./Button";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FCreateDocument, FDeleteDocument, FUpdateDocument } from "../api/route";

import { formToDocument } from "@artempoletsky/kurgandb/client";
import FieldLabel from "./FieldLabel";
import { Button, TextInput, Textarea, Tooltip } from "@mantine/core";
import { API_ENDPOINT } from "../generated";
import { PlainObject, blinkBoolean } from "../utils_client";


const updateDocument = getAPIMethod<FUpdateDocument>(API_ENDPOINT, "updateDocument");
const createDocument = getAPIMethod<FCreateDocument>(API_ENDPOINT, "createDocument");
const deleteDocument = getAPIMethod<FDeleteDocument>(API_ENDPOINT, "deleteDocument");


type Props = {
  document: PlainObject
  scheme: TableScheme
  insertMode?: boolean
  tableName: string
  id: string | number | undefined
  onCreated: (id: string | number) => void
  onDuplicate: () => void
};


export default function EditDocumentForm({ id, document: doc, scheme, insertMode, tableName, onCreated, onDuplicate }: Props) {

  const form = useRef<HTMLFormElement>(null);


  function getData() {
    if (!form.current) throw new Error("no form ref");

    const documentData = formToDocument(form.current, scheme);
    return documentData;
  }
  function save() {

    if (id === undefined) throw new Error("id is undefined");

    updateDocument({
      id,
      tableName,
      document: getData()
    }).then(() => blinkBoolean(setSavedTooltip));
  }

  function create() {
    createDocument({ tableName, document: getData() })
      .then(onCreated);
  }

  function remove() {
    if (id === undefined) throw new Error("id is undefined");

    if (!confirm("Are you sure you want delete this document?")) return;
    deleteDocument({ tableName, id })
      .then(onCreated);
  }

  const formTextDefaults: Record<string, string> = {};
  for (const fieldName of scheme.fieldsOrderUser) {
    let value = doc[fieldName];
    const type = scheme.fields[fieldName];
    if (type == "json") {
      value = JSON.stringify(value, null, 0);
    }
    formTextDefaults[fieldName] = value;
  }

  useEffect(() => {
    if (!form.current) throw new Error("no form ref");
    for (const fieldName in formTextDefaults) {
      const input = form.current.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`);
      if (!input) continue;
      input.value = formTextDefaults[fieldName];
    }
  }, [doc, id, scheme]);

  // const [formText, formTextSetter] = useState<Record<string, string>>(formTextDefaults);

  // function setFormText(fieldName: string) {
  //   return function (value: string) {
  //     formTextSetter({
  //       ...formText,
  //       [fieldName]: value
  //     });
  //   }
  // }
  const fields: ReactNode[] = [];
  for (const fieldName of scheme.fieldsOrderUser) {
    const type = scheme.fields[fieldName];
    const tags = new Set(scheme.tags[fieldName] || []);
    const isArea = type == "json" || tags.has("textarea");

    fields.push(<div className="mr-1" key={fieldName}>
      <FieldLabel fieldName={fieldName} scheme={scheme} />
      {isArea
        ? <Textarea resize="both" name={fieldName} />
        : <TextInput autoComplete="off" size="sm" variant="default" type="text" name={fieldName} />}
    </div>);
  }
  <TextInput

    id="standard-error-helper-text"

    defaultValue="Hello World"

  />
  const [savedTooltip, setSavedTooltip] = useState(false);
  return <div className="pl-5 min-w-[500px]">
    <form className="mb-5" ref={form}>{fields}</form>
    {insertMode
      ? <div><Button onClick={create}>Create</Button></div>
      : <div className="flex gap-1">
        <Tooltip opened={savedTooltip} label="Saved!">
          <Button onClick={save}>Save</Button>
        </Tooltip>
        <Button onClick={remove}>Remove</Button>
        <Button onClick={onDuplicate}>Duplicate</Button>
      </div>
    }
  </div>;
}