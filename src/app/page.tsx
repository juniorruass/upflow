import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, client_id")
    .eq("id", user.id)
    .single();

  // Quem tem client_id usa o painel do cliente por padrão, mesmo sendo upflu_admin
  // (caso de uso interno: a própria Upflu operando como cliente da plataforma).
  redirect(profile?.client_id ? "/app" : "/admin");
}
