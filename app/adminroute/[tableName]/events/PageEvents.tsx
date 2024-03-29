"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import { useErrorResponse, fetchCatch } from "@artempoletsky/easyrpc/react";
import { ReactNode, useEffect, useState } from "react";
import { RegisteredEvents } from "@artempoletsky/kurgandb/globals";
import { ActionIcon, Button } from "@mantine/core";
import { FGetTableEvents, FToggleAdminEvent, FUnregisterEvent } from "../../api/methods";
import { API_ENDPOINT } from "../../generated";
import { Trash } from "tabler-icons-react";
import { ParsedFunctionComponent } from "../../comp/ParsedFunctionComponent";
import { Store } from "../../StoreProvider";

const toggleAdminEvent = getAPIMethod<FToggleAdminEvent>(API_ENDPOINT, "toggleAdminEvent");
const unregisterEvent = getAPIMethod<FUnregisterEvent>(API_ENDPOINT, "unregisterEvent");


type Props = {
  tableName: string;
  registeredEvents: RegisteredEvents;
  adminEvents: string[];
};

export default function TestComponent({ tableName, registeredEvents: initialRegisteredEvents, adminEvents }: Props) {
  Store.setBreadcrumbs([
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Events" },
  ]);
  const [registeredEvents, setRegisteredEvents] = useState(initialRegisteredEvents);
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();


  const fcToggle = fetchCatch(toggleAdminEvent)
    .before((eventName) => {
      return {
        eventName,
        tableName,
      }
    })
    .then(setRegisteredEvents)
    .catch(setErrorResponse);

  const fcUnregister = fetchCatch(unregisterEvent)
    .before((eventName, namespaceId) => {
      if (!confirm("Are you sure you want to unregister this event?")) return;

      return {
        tableName,
        eventName,
        namespaceId,
      }
    })
    .then(setRegisteredEvents)
    .catch(setErrorResponse)

  const registeredGroups: ReactNode[] = [];
  for (const namespaceId in registeredEvents) {
    const events: ReactNode[] = [];
    for (const eventName in registeredEvents[namespaceId]) {
      const fn = registeredEvents[namespaceId][eventName];

      events.push(<ParsedFunctionComponent
        name={eventName}
        {...fn}
        onRemoveClick={fcUnregister.action(eventName, namespaceId)}
      />)
    }
    registeredGroups.push(<div className="pl-3 border-l border-stone-500" key={namespaceId}>
      <p className="">{namespaceId}</p>
      {events}
    </div>)
  }

  function isEventActive(eventName: string) {
    const adminEvents = registeredEvents["admin"];
    if (!adminEvents) return false;
    return !!adminEvents[eventName];
  }

  return (
    <div className="">
      <div className="flex">
        <div className="w-[550px] pr-3 border-r border-stone-500">
          <p className="font-bold text-xl mb-5">Admin panel events:</p>
          {adminEvents.map(name => <div className="mb-2" key={name}>
            <Button
              className="w-[250px] mr-3"
              onClick={fcToggle.action(name)}
            >{name}</Button> {isEventActive(name) && <span className="text-green-800">Active</span>}
          </div>)}
        </div>
        <div className="pl-3 w-[550px]">
          <p className="font-bold text-xl mb-5">Registered events:</p>
          {registeredGroups}
        </div>
      </div>
      <div className="text-red-600 min-h-[24px]">{mainErrorMessage}</div>

    </div>
  );
}