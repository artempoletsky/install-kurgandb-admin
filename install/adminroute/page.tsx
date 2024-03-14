
import Layout from "./comp/PageLayout";
import CreateNewTable from "./comp/CreateNewTable";
import { API_ENDPOINT, ROOT_PATH } from "./generated";
import Link from "./comp/Link";
import { getAllTables, type FGetAllTables } from "./api/methods";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "",
}

export const dynamic = "force-dynamic";

export default async function page() {

  const { tableNames, version } = await getAllTables({});

  metadata.title = version;
  return (
    <Layout>
      <div>{version}</div>
      <div className="flex">
        <ul className="mt-3 w-[350px]">
          {tableNames.map(id => <li className="mb-1" key={id}><Link href={`/${ROOT_PATH}/${id}/`}>{id}</Link></li>)}
        </ul>
        <CreateNewTable />
      </div>
    </Layout>
  );
}