import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KanbanBoard from "./KanbanBoard";

export default async function CrmPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id")
    .eq("id", user.id)
    .single();
  if (!profile?.client_id) redirect("/app");

  const { data: stages } = await supabase
    .from("kanban_stages")
    .select("id, name, position")
    .order("position", { ascending: true });

  const { data: cards } = await supabase
    .from("kanban_cards")
    .select("id, stage_id, position, contact:contacts(id, name, wa_id)")
    .order("position", { ascending: true });

  return (
    <KanbanBoard
      clientId={profile.client_id}
      initialStages={stages ?? []}
      initialCards={(cards ?? []).map((c) => ({
        ...c,
        contact: Array.isArray(c.contact) ? c.contact[0] : c.contact,
      }))}
    />
  );
}
