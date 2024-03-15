
import { getSchemeSafe, getTableCustomPageData } from "../../api/methods";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";

import CustomComponentPage from "./CustomComponentPage";
import TableNotFound from "../TableNotFound";
import { ResponseError } from "@artempoletsky/easyrpc";

type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { tableName } = params;
  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Custom" },
  ];


  try {
    const result = await getTableCustomPageData({ tableName })
    return (
      <Layout breadcrumbs={crumbs} tableName={tableName}>
        <CustomComponentPage {...result} tableName={tableName} />
      </Layout>
    );
  } catch (err: any) {
    if (err instanceof ResponseError) {
      return <Layout breadcrumbs={crumbs} tableName={tableName}>
        <TableNotFound tableName={tableName} />
      </Layout>
    }
    throw err;
  }

}