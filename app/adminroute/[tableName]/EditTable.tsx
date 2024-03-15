"use client";

import Paginator from "../comp/paginator";
import EditDocumentForm from "./EditDocumentForm";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FGetDraft, FGetFreeId, FGetPage, FReadDocument, RGetPage } from "../api/methods";
import { fetchCatch, getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { Button, Textarea } from "@mantine/core";
import RequestError from "../comp/RequestError";
import { API_ENDPOINT } from "../generated";
import css from "../admin.module.css";

import { PlainObject } from "@artempoletsky/kurgandb/globals";

import { encode, decode } from "@hugov/shorter-string";


const readDocument = getAPIMethod<FReadDocument>(API_ENDPOINT, "readDocument");
const getPage = getAPIMethod<FGetPage>(API_ENDPOINT, "getPage");
const getDraft = getAPIMethod<FGetDraft>(API_ENDPOINT, "getDraft");
const getFreeId = getAPIMethod<FGetFreeId>(API_ENDPOINT, "getFreeId");


type Props = {
  tableName: string
  page?: number
  scheme: TableScheme
}


export default function EditTable({ tableName, scheme }: Props) {


  let [record, setRecord] = useState<PlainObject | undefined>(undefined);
  let [currentId, setCurrentId] = useState<string | number | undefined>(undefined);
  let [pageData, setPageData] = useState<RGetPage | undefined>(undefined);
  let [page, setPage] = useState<number>(1);
  const queryDefault = "table.all()";
  // let [queryString, setQueryString] = useState<string>(queryDefault);

  const queryInput = useRef<HTMLTextAreaElement>(null);
  let [insertMode, setInsertMode] = useState<boolean>(false);

  const [setRequestError, , requestError] = useErrorResponse();

  const fc = fetchCatch({
    errorCatcher: setRequestError,
  });

  const fcOpenRecord = fc.method(readDocument)
    .before((id: string | number) => {
      setCurrentId(id);
      return {
        tableName,
        id,
      }
    })
    .then(rec => {
      setInsertMode(false);
      setRecord(rec);
    });

  let primaryKey = Object.keys(scheme.tags).find(id => {
    return scheme.tags[id]?.includes("primary") || false;
  }) || "";
  if (!primaryKey) throw new Error("primary key is undefined");
  let autoincId = scheme.tags[primaryKey].includes("autoinc");


  const loadPage = useCallback((page: number) => {
    setRequestError();
    setRecord(undefined);
    setPage(page);

    const queryString = !queryInput.current ? queryDefault : queryInput.current.value;
    if (queryString != queryDefault) {
      window.location.hash = "#q=" + queryString;
    }else {
      window.location.hash = "";
    }

    getPage({
      page,
      queryString,
      tableName
    }).then(setPageData)
      .catch(setRequestError);
  }, [tableName, setRequestError])
  // function loadPage() {

  // }

  function insert() {
    // setInsertMode(true);
    setRequestError();
    getDraft({ tableName })
      .then((draft) => {
        setRecord(draft);
        setInsertMode(true);
      })
      .catch(setRequestError);
  }

  function onDocCreated() {
    loadPage(page);
    setRecord(undefined);
  }

  function onDuplicate() {
    if (autoincId) {
      const newDoc = { ...record };
      delete newDoc[primaryKey];
      setRecord(newDoc);
      setInsertMode(true);
      return;
    }
    setRequestError();
    getFreeId({ tableName })
      .then(newId => {
        setRecord({
          ...record,
          [primaryKey]: newId
        });
        setInsertMode(true);
      })
      .catch(setRequestError);
  }


  useEffect(() => {

    try {
      const locationFull = window.location.hash;
      const decodedURI = decodeURI(locationFull);


      const urlParams = new URLSearchParams(decodedURI.replace("#", "?"));

      const q = urlParams.get("q") || "";
      const userQuery = q && (q);


      if (userQuery && queryInput.current) {
        queryInput.current.innerHTML = userQuery;
        queryInput.current.value = userQuery;
      }
    } catch (err) {
      console.log(err);
    }

    loadPage(1);
  }, [loadPage]);



  function onClose() {
    setRecord(undefined);
  }
  const getInvalidRecordsRequest = `t.filter($.invalid)`;
  const whereRequest = `t.where("${"id"}", "new_id")`;
  const startsWith = `t.where("${"id"}", value => value.startsWith("a"))`;

  function setQuery(string: string) {
    if (!queryInput.current) throw new Error("Error");

    queryInput.current.value = string;
  }
  return (
    <div>
      <div className="mt-3 mb-1 flex gap-1">
        <div className="">
          <Textarea defaultValue={queryDefault} className="min-w-[500px]" resize="vertical" ref={queryInput} />
          <div className="flex gap-3 mt-2">
            <i onClick={e => setQuery(queryDefault)}
              className={css.pseudo}>All</i>
            <i onClick={e => setQuery(whereRequest)}
              className={css.pseudo}>Where</i>
            <i onClick={e => setQuery(startsWith)}
              className={css.pseudo}>Stars with</i>
            <i onClick={e => setQuery(getInvalidRecordsRequest)}
              className={css.pseudo}>Invalid</i>
          </div>
        </div>
        <Button className="align-top" onClick={e => loadPage(1)}>Select</Button>
        <div className="border-l border-gray-500 mx-3 h-[34px]"></div>
        <Button className="align-top" onClick={insert}>New record</Button>
      </div>
      <RequestError requestError={requestError} />
      {pageData
        ? <div className="">
          <div className="flex">
            <ul className={css.sidebar}>
              {pageData.documents.map(id => <li className={css.item} key={id} onClick={fcOpenRecord.action(id)}>{id}</li>)}
            </ul>
            {scheme && record && <EditDocumentForm
              onClose={onClose}
              insertMode={insertMode}
              recordId={currentId}
              tableName={tableName}
              scheme={scheme}
              record={record}
              onDeleted={onDocCreated}
              onCreated={onDocCreated}
              onDuplicate={onDuplicate}
              onRequestError={setRequestError}
            />}
          </div>
          <Paginator page={page} pagesCount={pageData.pagesCount} onSetPage={loadPage}></Paginator>
        </div>
        : <div className="">Loading...</div>
      }


    </div>

  );
}