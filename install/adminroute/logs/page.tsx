
import { FGetLogsListPage } from "../api/methods";
import ComponentLoader from "../comp/ComponentLoader";
import PageLogs from "./PageLogs";
import { Metadata, ResolvingMetadata } from 'next';


export const metadata: Metadata = {
  title: "",
};

export const dynamic = "force-dynamic";

type Props = {};
export default async function page(props: Props) {
  // const logsList = await getLogsList({});
  metadata.title = `Logs KurganDB`;
  const getLogsListPage = "getLogsListPage" as unknown as FGetLogsListPage;
  return (
    <ComponentLoader
      method={getLogsListPage}
      Component={PageLogs}
      args={{}}
    />
  );
}
