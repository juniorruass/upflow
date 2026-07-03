import Link from "next/link";
import type { DashboardData } from "@/lib/mock-data/dashboard";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ConversationRow({
  conversation,
}: {
  conversation: DashboardData["recentConversations"][number];
}) {
  const isHuman = conversation.status === "human";

  return (
    <Link
      href={`/app/crm/${conversation.id}`}
      className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors duration-200 hover:bg-bg-elevated-2"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated-2 font-body text-xs font-medium text-text-primary">
        {initials(conversation.contactName)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-medium text-text-primary">
          {conversation.contactName}
        </p>
        <p className="truncate text-xs text-text-dim">{conversation.lastMessagePreview}</p>
      </div>

      <span
        className="shrink-0 rounded-[99px] px-2 py-0.5 text-xs font-medium"
        style={{
          color: isHuman ? "var(--amber)" : "var(--accent-bright)",
          backgroundColor: isHuman ? "rgba(212,162,76,0.12)" : "rgba(15,184,204,0.12)",
        }}
      >
        {isHuman ? "Humano" : "Bot"}
      </span>

      <span className="shrink-0 font-mono-data text-xs text-text-faint">{conversation.timeAgo}</span>
    </Link>
  );
}
