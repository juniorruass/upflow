import Link from "next/link";
import PulseLine from "@/components/ui/PulseLine";
import type { ConnectionStatus } from "@/lib/mock-data/dashboard";

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; dotColor: string; dotAnimation: "ping" | "pulse" | "none" }
> = {
  connected: { label: "Conectado", dotColor: "var(--success)", dotAnimation: "ping" },
  connecting: { label: "Conectando...", dotColor: "var(--amber)", dotAnimation: "pulse" },
  disconnected: { label: "Desconectado", dotColor: "var(--text-faint)", dotAnimation: "none" },
};

function StatusDot({ color, animation }: { color: string; animation: "ping" | "pulse" | "none" }) {
  if (animation === "ping") {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: color }}
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex h-2.5 w-2.5 rounded-full ${animation === "pulse" ? "animate-pulse" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

export default function ConnectionStatusCard({
  status,
  phoneNumber,
}: {
  status: ConnectionStatus;
  phoneNumber: string;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className="group rounded-[14px] border border-border bg-bg-elevated p-5 transition-colors duration-200 hover:border-border-hover"
      style={{ boxShadow: "none" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StatusDot color={config.dotColor} animation={config.dotAnimation} />
          <span className="font-body text-sm font-medium text-text-primary">{config.label}</span>
        </div>
        <span className="font-mono-data text-xs text-text-dim">{phoneNumber}</span>
      </div>

      <div className="mt-4">
        {status === "disconnected" ? (
          <Link
            href="/app/connect"
            className="inline-flex items-center rounded-[99px] bg-accent px-4 py-1.5 text-sm font-medium text-text-primary transition-colors duration-200 hover:bg-accent-bright"
          >
            Reconectar
          </Link>
        ) : (
          <PulseLine active={status === "connected"} />
        )}
      </div>
    </div>
  );
}
