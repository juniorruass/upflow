import Link from "next/link";

export default async function FlowCanvasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm text-text-dim">Editor de fluxo — em construção</p>
      <p className="font-mono-data text-xs text-text-faint">{id}</p>
      <Link href="/app" className="text-sm text-accent-bright hover:text-text-primary">
        ← Voltar pro início
      </Link>
    </main>
  );
}
