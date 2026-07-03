import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
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

  // Acesso ao painel do cliente é definido por ter um client_id vinculado,
  // não pelo role -- um upflu_admin também pode ter client_id (uso interno).
  if (!profile?.client_id) redirect("/admin");

  return <div className="flex min-h-screen flex-1 flex-col">{children}</div>;
}
