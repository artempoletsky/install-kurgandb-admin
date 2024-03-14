
import type { EventTableOpen, EventRecordChange } from "@artempoletsky/kurgandb/globals";

import { User, UserFull, UserLight, UsersMeta } from "@/globals";
type TableEventsDeclaration = Record<string, (event: any) => void>

// EventTableOpen<UserFull, string, UsersMeta, UserFull, UserLight, User>
export const users: TableEventsDeclaration = {
  "tableOpen": ({ $ }: EventTableOpen<UserFull, string, UsersMeta, UserFull, UserLight, User>) => {
    const tableName = "users";
    $.log(`Table '${tableName}' has been opened.`, "", "info");
  },
  "recordChange:password": ({ $, newValue, oldValue, record, table }: EventRecordChange<UserFull, string, UsersMeta, UserFull, UserLight, User, string>) => {
    $.log(`User '${record.username}' has changed his password from '${oldValue}' to '${newValue}'`, "", "info");
  },
}

