
import { FGetPlugins } from "../api/methods";
import ComponentLoader from "../comp/ComponentLoader";
import Layout from "../comp/PageLayout";
import PagePlugins from "./PagePlugins";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "",
};

export const dynamic = "force-dynamic";

type Props = {};
export default async function page(props: Props) {

  // const logsList = await getLogsList({});
  metadata.title = `Plugins KurganDB`;
  const getPlugins = "getPlugins" as unknown as FGetPlugins;
  return (
    <Layout>
      <ComponentLoader
        method={getPlugins}
        Component={PagePlugins}
        args={{}}
      />
    </Layout >
  );
}
