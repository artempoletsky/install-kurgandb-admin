
import { getScheme } from "../api/route";
import Layout, { BreadrumbsArray } from "../comp/layout";

// import type { FGetScheme, FReadDocument } from "../api/route";




export default async function () {

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: "", title: "Scripts" },
  ];

  return (
    <Layout breadcrumbs={crumbs}>
      not implemented yet
    </Layout>
  );
}