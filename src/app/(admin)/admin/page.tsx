import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, slug, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Link
          href="/admin/clients/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Novo cliente
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 dark:border-white/10">
            <th className="py-2">Nome</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {(clients ?? []).map((client) => (
            <tr key={client.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">
                <Link href={`/admin/clients/${client.id}`} className="underline">
                  {client.name}
                </Link>
              </td>
              <td className="py-2">{client.slug}</td>
              <td className="py-2">{client.status}</td>
            </tr>
          ))}
          {(clients ?? []).length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-zinc-500">
                Nenhum cliente ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
