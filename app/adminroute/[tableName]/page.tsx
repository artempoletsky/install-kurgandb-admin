
import Layout, { BreadrumbsArray } from "../comp/PageLayout";

// import type { FGetScheme, FReadDocument } from "../api/route";
import { getScheme } from "../api/methods";
import { TableScheme } from "@artempoletsky/kurgandb/globals";
import PageEditRecords from "./PageEditRecords";



type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}


export const dynamic = "force-static";


export default async function page({ params }: Props) {
  const { tableName } = params;

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: "", title: tableName },
  ];

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>

      <PageEditRecords tableName={tableName}></PageEditRecords>
    </Layout>
  );
}