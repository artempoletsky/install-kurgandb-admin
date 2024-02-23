"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";

// import Button from "./Button";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ValiationErrorResponce, getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FCreateDocument, FDeleteDocument, FUpdateDocument } from "../api/route";

import { formToDocument } from "@artempoletsky/kurgandb/client";
import FieldLabel from "../comp/FieldLabel";
import { Button, Checkbox, TextInput, Textarea, Tooltip } from "@mantine/core";
import { API_ENDPOINT } from "../generated";
import { PlainObject, blinkBoolean } from "../utils_client";
import { $, FieldTag, FieldType } from "@artempoletsky/kurgandb/globals";



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
  onRequestError: (e: ValiationErrorResponce) => void
};


export default function EditDocumentForm({ id, document: doc, scheme, insertMode, tableName, onCreated, onDuplicate, onRequestError }: Props) {

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
    }).then(() => blinkBoolean(setSavedTooltip))
      .catch(onRequestError);
  }

  function create() {
    const data = getData();

    createDocument({ tableName, document: data })
      .then(onCreated)
      .catch(onRequestError);
  }

  function remove() {
    if (id === undefined) throw new Error("id is undefined");

    if (!confirm("Are you sure you want delete this document?")) return;
    deleteDocument({ tableName, id })
      .then(onCreated)
      .catch(onRequestError);
  }

  // const formTextDefaults: Record<string, any> = {};
  // for (const fieldName of scheme.fieldsOrderUser) {
  //   let value: any = "";
  //   const type = scheme.fields[fieldName];
  //   if (type == "json") {
  //     value = JSON.stringify(value, null, 0);
  //   } else if (type == "boolean") {
  //     value = false;
  //   }
  //   formTextDefaults[fieldName] = value;
  // }

  useEffect(() => {
    if (!form.current) throw new Error("no form ref");
    for (const fieldName in scheme.fields) {
      const type = scheme.fields[fieldName];
      const input: HTMLInputElement | HTMLTextAreaElement | null = form.current.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`);
      if (!input) continue;
      if (type == "boolean") {
        (input as HTMLInputElement).checked = doc[fieldName];
      } else if (type == "json") {
        input.value = JSON.stringify(doc[fieldName]);
      } else {
        input.value = doc[fieldName];
      }
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
  function cypherField(fieldName: string) {
    if (!form.current) throw new Error("no form ref");

    const input = form.current.querySelector<HTMLInputElement>(`[name=${fieldName}]`);
    if (!input) throw new Error("input not found");

    input.value = $.encodePassword(input.value);
  }

  function printField(fieldName: string, type: FieldType, tags: Set<FieldTag>): ReactNode {
    const isArea = type == "json" || tags.has("textarea");
    if (isArea) return <Textarea resize="both" name={fieldName} />;

    if (type == "boolean") {
      return <Checkbox name={fieldName} />
    }

    if (type == "string" && tags.has("hidden")) {
      return <div className="flex gap-3">
        <div className="grow">
          <TextInput autoComplete="off" size="sm" variant="default" type="text" name={fieldName} />
        </div>
        <div className="shrink">
          <Button onClick={e => cypherField(fieldName)} className="shrink">Cypher</Button>
        </div>
      </div>
    }

    return <TextInput autoComplete="off" size="sm" variant="default" type="text" name={fieldName} />;
  }

  const fields: ReactNode[] = [];
  for (const fieldName of scheme.fieldsOrderUser) {
    const type = scheme.fields[fieldName];
    const tags = new Set(scheme.tags[fieldName] || []);
    if (tags.has("autoinc") && insertMode) continue;


    fields.push(<div className="mr-1" key={fieldName}>
      <FieldLabel fieldName={fieldName} scheme={scheme} />
      {printField(fieldName, type, tags)}
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