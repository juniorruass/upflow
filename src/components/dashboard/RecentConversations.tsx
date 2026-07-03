import Link from "next/link";
import ConversationRow from "./ConversationRow";
import type { DashboardData } from "@/lib/mock-data/dashboard";

export default function RecentConversations({
  conversations,
}: {
  conversations: DashboardData["recentConversations"];
}) {
  // Quem precisa de atendimento humano aparece primeiro.
  const sorted = [...conversations].sort((a, b) =>
    a.status === b.status ? 0 : a.status === "human" ? -1 : 1
  );

  return (
    <div className="rounded-[14px] border border-border bg-bg-elevated p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Conversas recentes
        </h2>
        <Link
          href="/app/crm"
          className="text-sm text-accent-bright transition-colors duration-200 hover:text-text-primary"
        >
          Abrir CRM →
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {sorted.map((conversation) => (
          <ConversationRow key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}
