"use client";

import { useState, useEffect, useRef } from "react";
import { getContractEvents } from "../lib/contract";

export function useContractEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const lastLedger = useRef<number | undefined>(undefined);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const newEvents = await getContractEvents(lastLedger.current);
      if (newEvents && newEvents.length > 0) {
        setEvents((prev) => [...newEvents, ...prev].slice(0, 50));
        // Update lastLedger to avoid duplicates
        const maxLedger = Math.max(...newEvents.map((e: any) => e.ledger));
        lastLedger.current = maxLedger + 1;
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  return events;
}
