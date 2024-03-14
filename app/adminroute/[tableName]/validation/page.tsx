
import PageValidation from "./PageValidation";
import { Metadata } from "next";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";
import { getTableValidation } from "../../api/methods";


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
    { href: "", title: "Validation rules" },
  ];

  metadata.title = `${tableName} events`;
  const validation = await getTableValidation({ tableName });

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      <PageValidation {...validation} tableName={tableName}></PageValidation>
    </Layout>
  );
}