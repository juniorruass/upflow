import Link from "next/link";

export default function NewFlowPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm text-text-dim">Canvas de novo fluxo — em construção</p>
      <Link href="/app" className="text-sm text-accent-bright hover:text-text-primary">
        ← Voltar pro início
      </Link>
    </main>
  );
}
