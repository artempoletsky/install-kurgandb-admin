
import { FGetLogsListPage } from "../api/methods";
import ComponentLoader from "../comp/ComponentLoader";
import LogsPage from "./LogsPage";
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
      Component={LogsPage}
      args={{}}
    />
  );
}
