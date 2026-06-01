"use client";

import { useEffect, useState } from "react";
import { subscribeDataStore } from "@/lib/db/data-store";

/** Re-render when any entity in the data store changes. */
export function useDataStoreVersion(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    return subscribeDataStore(() => setVersion((v) => v + 1));
  }, []);

  return version;
}
