import Link from "next/link";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm text-text-dim">Conversa individual — em construção</p>
      <p className="font-mono-data text-xs text-text-faint">{conversationId}</p>
      <Link href="/app/crm" className="text-sm text-accent-bright hover:text-text-primary">
        ← Voltar pro CRM
      </Link>
    </main>
  );
}
