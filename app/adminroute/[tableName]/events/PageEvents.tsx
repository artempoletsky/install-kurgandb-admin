"use client";

import { fetchCatch, getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";
import { ReactNode, useState } from "react";
import { RegisteredEvents } from "@artempoletsky/kurgandb/globals";
import { Button } from "@mantine/core";
import { FToggleAdminEvent } from "../../api/methods";
import { API_ENDPOINT } from "../../generated";

const toggleAdminEvent = getAPIMethod<FToggleAdminEvent>(API_ENDPOINT, "toggleAdminEvent");


type Props = {
  adminEvents: string[];
  registeredEvents: RegisteredEvents;
  tableName: string;
};

export default function TestComponent({ adminEvents, registeredEvents: initialRegisteredEvents, tableName }: Props) {
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");
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

  const registeredGroups: ReactNode[] = [];
  for (const namespaceId in registeredEvents) {
    const events: ReactNode[] = [];
    for (const eventName in registeredEvents[namespaceId]) {
      const fun = registeredEvents[namespaceId][eventName];

      events.push(<details key={namespaceId + eventName} className="">
        <summary>{eventName}</summary>
        {fun.args}<br />
        <p className="whitespace-pre">
          {fun.body}
        </p>
      </details>)
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