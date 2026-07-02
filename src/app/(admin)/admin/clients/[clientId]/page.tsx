import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, slug, status")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  const { data: instances } = await supabase
    .from("whatsapp_instances")
    .select("id, uazapi_name, status, phone_number")
    .eq("client_id", clientId);

  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">{client.name}</h1>
      <p className="text-sm text-zinc-500">
        {client.slug} · {client.status}
      </p>

      <div>
        <h2 className="mb-2 font-medium">Instâncias WhatsApp</h2>
        {(instances ?? []).length === 0 && (
          <p className="text-sm text-zinc-500">Sem instância provisionada.</p>
        )}
        <ul className="flex flex-col gap-2">
          {(instances ?? []).map((instance) => (
            <li
              key={instance.id}
              className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10"
            >
              {instance.uazapi_name} — {instance.status}
              {instance.phone_number && ` (${instance.phone_number})`}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
