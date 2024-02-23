"use client";

import Paginator from "../comp/paginator";
import EditDocumentForm from "./EditDocumentForm";
import { useEffect, useState } from "react";
import type { FGetDraft, FGetFreeId, FGetPage, FGetScheme, FReadDocument, FRemoveTable, RGetPage } from "../api/route";
import { ValiationErrorResponce, getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";
import { Button, Textarea } from "@mantine/core";
import RequestError from "../comp/RequestError";
import { API_ENDPOINT } from "../generated";
import { PlainObject } from "../utils_client";
import TableMenu from "../comp/TableMenu";




const readDocument = getAPIMethod<FReadDocument>(API_ENDPOINT, "readDocument");
const getPage = getAPIMethod<FGetPage>(API_ENDPOINT, "getPage");
const getDraft = getAPIMethod<FGetDraft>(API_ENDPOINT, "getDraft");
const getFreeId = getAPIMethod<FGetFreeId>(API_ENDPOINT, "getFreeId");


type Props = {
  tableName: string
  page?: number
  scheme: TableScheme
}


export default function ({ tableName, scheme }: Props) {


  let [doc, setDocument] = useState<PlainObject | undefined>(undefined);
  let [currentId, setCurrentId] = useState<string | number | undefined>(undefined);
  let [pageData, setPageData] = useState<RGetPage | undefined>(undefined);
  let [page, setPage] = useState<number>(1);
  let [queryString, setQueryString] = useState<string>("table.all()");
  let [insertMode, setInsertMode] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<ValiationErrorResponce | undefined>(undefined);


  let primaryKey = Object.keys(scheme.tags).find(id => {
    return scheme.tags[id]?.includes("primary") || false;
  }) || "";
  if (!primaryKey) throw new Error("primary key is undefined");
  let autoincId = scheme.tags[primaryKey].includes("autoinc");

  function openDocument(id: string | number) {
    setRequestError(undefined);
    setInsertMode(false);
    setCurrentId(id);
    readDocument({
      tableName,
      id
    }).then(setDocument)
      .catch(setRequestError);
  }

  function loadPage(page: number) {
    setRequestError(undefined);
    setDocument(undefined);
    setPage(page);
    getPage({
      page,
      queryString,
      tableName
    }).then(setPageData)
      .catch(setRequestError);
  }

  function insert() {
    // setInsertMode(true);
    setRequestError(undefined);
    getDraft({ tableName })
      .then((draft) => {
        setDocument(draft);
        setInsertMode(true);
      })
      .catch(setRequestError);
  }

  function onDocCreated() {
    loadPage(page);
    setDocument(undefined);
  }

  function onDuplicate() {
    if (autoincId) {
      const newDoc = { ...doc };
      delete newDoc[primaryKey];
      setDocument(newDoc);
      setInsertMode(true);
      return;
    }
    setRequestError(undefined);
    getFreeId({ tableName })
      .then(newId => {
        setDocument({
          ...doc,
          [primaryKey]: newId
        });
        setInsertMode(true);
      })
      .catch(setRequestError);
  }


  useEffect(() => {
    loadPage(1);
  }, []);

  if (!pageData) {
    return <div>Loading...</div>;
  }

  // console.log(pageData.documents);


  return (
    <div>
      <div className="mt-3 mb-1 flex gap-1">
        <Textarea className="min-w-[500px]" resize="vertical" value={queryString} onChange={e => setQueryString(e.target.value)} />
        <Button className="align-top" onClick={e => loadPage(1)}>Select</Button>
        <div className="border-l border-gray-500 mx-3 h-[34px]"></div>
        <Button className="align-top" onClick={insert}>New document</Button>
      </div>
      <div className="flex">
        <ul className="mt-3 flex-shrink pr-3 border-r border-stone-600 border-solid min-w-[350px] min-h-[675px]">
          {pageData.documents.map(id => <li className="cursor-pointer py-1 border-b border-gray-500" key={id} onClick={e => openDocument(id)}>{id}</li>)}
        </ul>
        {scheme && doc && <EditDocumentForm
          insertMode={insertMode}
          id={currentId}
          tableName={tableName}
          scheme={scheme}
          document={doc}
          onCreated={onDocCreated}
          onDuplicate={onDuplicate}
          onRequestError={setRequestError}
        />}
      </div>
      <Paginator page={page} pagesCount={pageData.pagesCount} onSetPage={loadPage}></Paginator>
      <RequestError requestError={requestError} />

      <TableMenu tableName={tableName} />
    </div>

  );
}