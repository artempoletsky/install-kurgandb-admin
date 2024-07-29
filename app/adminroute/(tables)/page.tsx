

import CreateNewTable from "../comp/CreateNewTable";

import { getDBVersion, type FGetAllTablesPage } from "../api/methods";
import { Metadata } from "next";
import PageTables from "./PageTables";
import ComponentLoader from "../comp/ComponentLoader";
import { DB_TYPE } from "../generated";


export const metadata: Metadata = {
  title: "",
}

export const dynamic = "force-dynamic";

export default async function Page() {

  const { adminVersion, dbVersion } = await getDBVersion({});


  metadata.title = adminVersion;
  const getAllTablesPage = "getAllTablesPage" as unknown as FGetAllTablesPage;

  return (
    <>
      <div>{adminVersion} / {dbVersion}</div>
      <div className="flex">
        <div className="mt-3 w-[350px]">
          <ComponentLoader
            Component={PageTables}
            method={getAllTablesPage}
            args={{}}
          />
        </div>
        {DB_TYPE == "kurgandb" && <CreateNewTable />}
      </div>
    </>
  );
}