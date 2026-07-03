"use client";

import { useState } from "react";
import Link from "next/link";
import FlowCard from "./FlowCard";
import { updateFlowActive, type DashboardData } from "@/lib/mock-data/dashboard";

export default function FlowsGrid({ initialFlows }: { initialFlows: DashboardData["flows"] }) {
  const [flows, setFlows] = useState(initialFlows);

  async function handleToggle(id: string, active: boolean) {
    const previous = flows;
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, active } : f)));

    try {
      await updateFlowActive(id, active);
    } catch {
      setFlows(previous);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {flows.map((flow) => (
        <FlowCard key={flow.id} {...flow} onToggle={handleToggle} />
      ))}

      <Link
        href="/app/flows/new"
        className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-border text-text-dim transition-colors duration-200 hover:border-border-hover hover:text-text-primary"
      >
        <span className="text-2xl leading-none">+</span>
        <span className="text-sm">Novo fluxo</span>
      </Link>
    </div>
  );
}
