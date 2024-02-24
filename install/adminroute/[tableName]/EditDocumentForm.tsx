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
import { blinkBoolean } from "../utils_client";
import { $, FieldTag, FieldType, PlainObject } from "@artempoletsky/kurgandb/globals";

import { fieldScripts } from "../../kurgandb_admin/field_scripts";
import { FieldScriptArgs, ScriptsRecord, formatCamelCase } from "../globals";
import CustomDocumentComponent from "../../kurgandb_admin/components/CustomComponentRecord";

const updateDocument = getAPIMethod<FUpdateDocument>(API_ENDPOINT, "updateDocument");
const createDocument = getAPIMethod<FCreateDocument>(API_ENDPOINT, "createDocument");
const deleteDocument = getAPIMethod<FDeleteDocument>(API_ENDPOINT, "deleteDocument");


type Props = {
  record: PlainObject
  scheme: TableScheme
  insertMode?: boolean
  tableName: string
  recordId: string | number | undefined
  onCreated: (id: string | number) => void
  onDuplicate: () => void
  onRequestError: (e: ValiationErrorResponce) => void
};




export default function EditDocumentForm({ recordId, record, scheme, insertMode, tableName, onCreated, onDuplicate, onRequestError }: Props) {

  const form = useRef<HTMLFormElement>(null);


  function getData() {
    if (!form.current) throw new Error("no form ref");

    const documentData = formToDocument(form.current, scheme);
    return documentData;
  }
  function save() {

    if (recordId === undefined) throw new Error("id is undefined");

    updateDocument({
      id: recordId,
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
    if (recordId === undefined) throw new Error("id is undefined");

    if (!confirm("Are you sure you want delete this document?")) return;
    deleteDocument({ tableName, id: recordId })
      .then(onCreated)
      .catch(onRequestError);
  }

  const currentFieldScripts = fieldScripts[tableName] || {};
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
        (input as HTMLInputElement).checked = record[fieldName];
      } else if (type == "json") {
        input.value = JSON.stringify(record[fieldName]);
      } else {
        input.value = record[fieldName];
      }
    }
  }, [record, recordId, scheme]);

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

  function printScripts(scripts: ScriptsRecord, fieldName: string) {

    const scriptNames: Record<string, string> = {};
    for (const key in scripts) {
      scriptNames[key] = formatCamelCase(key);
    }
    const scriptKeys = Object.keys(scriptNames);


    if (scriptKeys.length == 0) {
      return "";
    }

    function onScriptTrigger(key: string) {

      if (!form.current) throw new Error("no form ref");
      const input = form.current.querySelector<HTMLInputElement>(`[name=${fieldName}]`);
      if (!input) throw new Error("input not found");
      scripts[key]({
        form: form.current,
        input,
        tableName,
        doc: record,
        value: input.value,
      });
    }
    if (scriptKeys.length == 1) {
      const key = scriptKeys[0];
      return <Button onClick={e => onScriptTrigger(key)} className="shrink">{scriptNames[key]}</Button>
    }
    return "non implemented yet";
  }

  function printField(fieldName: string, type: FieldType, tags: Set<FieldTag>): ReactNode {
    const isArea = type == "json" || tags.has("textarea");
    if (isArea) return <Textarea resize="both" name={fieldName} />;

    if (type == "boolean") {
      return <Checkbox name={fieldName} />
    }

    const scriptsObject = currentFieldScripts[fieldName];
    if (scriptsObject) {
      return <div className="flex gap-3">
        <div className="grow">
          <TextInput autoComplete="off" size="sm" variant="default" type="text" name={fieldName} />
        </div>
        <div className="shrink">
          {printScripts(scriptsObject, fieldName)}
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

  function onUpdateRecord(record: PlainObject) {
    for (const key in record) {
      const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name=${key}]`);
      if (!input) continue;
      const value = record[key];
      if (input.type == "checkbox" && "checked" in input) {
        input.checked = value;
      } else {
        input.value = value;
      }
    }
  }

  return <div className="pl-5 flex gap-3 grow">
    <div className="min-w-[500px]">
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
    </div>
    <div className="grow">
      <CustomDocumentComponent
        onRequestError={onRequestError}
        onUpdateRecord={onUpdateRecord}
        tableName={tableName}
        record={record}
        recordId={recordId}
      />
    </div>
  </div>
}