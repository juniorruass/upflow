"use client";

import { useEffect, useState } from "react";
import { getDashboardData, type ConnectionStatus } from "@/lib/mock-data/dashboard";

// Hoje lê do mock; a troca por uma chamada real (ex: GET /api/instance/status)
// fica isolada aqui, sem precisar mexer em quem consome o hook.
export function useConnectionStatus() {
  const [data, setData] = useState<{ status: ConnectionStatus; phoneNumber: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    getDashboardData().then((dashboard) => {
      if (!cancelled) setData(dashboard.connection);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
