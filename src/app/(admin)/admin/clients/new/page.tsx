"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ tempPassword?: string; warning?: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok && res.status !== 207) {
      setError(data.error ?? "erro ao criar cliente");
      return;
    }

    setResult(data);
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-8">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-semibold">Novo cliente</h1>

        {!result && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder="Nome do negócio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
            />
            <input
              placeholder="slug (ex: barbearia-do-ze)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              pattern="[a-z0-9\-]+"
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
            />
            <input
              type="email"
              placeholder="E-mail do cliente"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-foreground px-5 py-2 font-medium text-background disabled:opacity-50"
            >
              {loading ? "Provisionando..." : "Criar cliente"}
            </button>
          </form>
        )}

        {result && (
          <div className="flex flex-col gap-3 rounded-md border border-black/10 p-4 text-sm dark:border-white/10">
            <p className="font-medium text-green-600">Cliente criado.</p>
            {result.tempPassword && (
              <p>
                Senha temporária: <code>{result.tempPassword}</code>
              </p>
            )}
            {result.warning && <p className="text-amber-600">{result.warning}</p>}
            <button onClick={() => router.push("/admin")} className="underline">
              Voltar pra lista
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
