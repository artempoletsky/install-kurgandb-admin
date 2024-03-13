import type { CallbackScope } from "@artempoletsky/kurgandb";
import type { EventTableOpen } from "@artempoletsky/kurgandb/globals";

type TableEventsDeclaration = Record<string, (event: any, scope: CallbackScope) => void>

// users - a table name
const users: TableEventsDeclaration = {
  "tableOpen": ({ $ }: EventTableOpen<any, any, any, any, any, any>) => {
    
  }
}

