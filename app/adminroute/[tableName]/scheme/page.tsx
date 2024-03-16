
import PageTableScheme from "./PageTableScheme"
import { getScheme } from "../../api/methods"
import Layout, { BreadrumbsArray } from "../../comp/PageLayout"


type Payload = {
  tableName: string
}
type Props = {
  params: Payload
}

export const dynamic = "force-static";

export default async function page({ params }: Props) {
  const { tableName } = params;
  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Edit scheme" },
  ];

  return <Layout breadcrumbs={crumbs} tableName={tableName}>
    <PageTableScheme tableName={tableName}></PageTableScheme>
  </Layout>
}