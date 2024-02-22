
import EditTableScheme from "./EditTableScheme"
import { getScheme } from "../../api/route"
import Layout, { BreadrumbsArray } from "../../comp/layout"
import TableMenu from "../../comp/TableMenu"


type Payload = {
  tableName: string
}
type Props = {
  params: Payload
}

export default async function ({ params }: Props) {
  const { tableName } = params;
  const scheme = await getScheme(params);
  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Edit scheme" },
  ];
    
  return <Layout breadcrumbs={crumbs}>
    <EditTableScheme tableName={tableName} scheme={scheme}></EditTableScheme>
    <TableMenu tableName={tableName} />
  </Layout>
}