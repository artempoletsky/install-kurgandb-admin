


type Props = {
  documents: string[] | number[];
  onRecordSelect(id: string | number): void;
}
export default function RecordsList({ documents, onRecordSelect }: Props) {
  if (!documents.length) return <div className="sidebar">No records found</div>

  return <ul className="sidebar">
    {documents.map(id => <li className="sidebar_li" key={id} onClick={e => onRecordSelect(id)}>{id}</li>)}
  </ul>
}