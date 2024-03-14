
import PageEvents from "./PageEvents";
import { Metadata } from "next";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";
import { getTableEvents } from "../../api/methods";


type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

export const metadata: Metadata = {
  title: "",
};

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { tableName } = params;

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Events" },
  ];

  metadata.title = `${tableName} events`;
  const events = await getTableEvents({ tableName });

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      <PageEvents {...events} tableName={tableName}></PageEvents>
    </Layout>
  );
}