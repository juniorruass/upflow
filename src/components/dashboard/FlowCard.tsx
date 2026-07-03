"use client";

import { useRouter } from "next/navigation";
import Toggle from "@/components/ui/Toggle";
import Sparkline from "@/components/ui/Sparkline";

export default function FlowCard({
  id,
  name,
  active,
  triggerCount,
  periodLabel,
  sparklineData,
  onToggle,
}: {
  id: string;
  name: string;
  active: boolean;
  triggerCount: number;
  periodLabel: string;
  sparklineData: number[];
  onToggle: (id: string, active: boolean) => void;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/app/flows/${id}`)}
      className="cursor-pointer rounded-[14px] border border-border bg-bg-elevated p-5 transition-colors duration-200 hover:border-border-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-body text-sm font-medium text-text-primary">{name}</h3>
        <Toggle checked={active} onChange={(next) => onToggle(id, next)} aria-label={`Ativar/desativar ${name}`} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-text-primary">{triggerCount}</p>
          <p className="text-xs text-text-dim">disparos em {periodLabel}</p>
        </div>
        <Sparkline data={sparklineData} flat={!active} />
      </div>
    </div>
  );
}
