import type { CallbackScope } from "@artempoletsky/kurgandb";
import type { EventTableOpen } from "@artempoletsky/kurgandb/globals";

type TableEventsDeclaration = Record<string, (event: any, scope: CallbackScope) => void>


const exampleTable1: TableEventsDeclaration = {
  "tableOpen": (event: EventTableOpen<any, any, any, any, any, any>, scope) => {

  }
}

