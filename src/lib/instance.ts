import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export class InstanceResolutionError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Resolve o token da instância WhatsApp do client logado na sessão atual.
// Nunca aceita token vindo do browser -- só o service role lê whatsapp_instance_secrets.
export async function resolveInstanceToken() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new InstanceResolutionError("unauthorized", 401);

  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id")
    .eq("id", user.id)
    .single();
  if (!profile?.client_id) {
    throw new InstanceResolutionError("usuário sem client associado", 400);
  }

  const admin = createAdminClient();
  const { data: instance } = await admin
    .from("whatsapp_instances")
    .select("id")
    .eq("client_id", profile.client_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!instance) {
    throw new InstanceResolutionError("nenhuma instância provisionada pra esse cliente", 404);
  }

  const { data: secret } = await admin
    .from("whatsapp_instance_secrets")
    .select("uazapi_token")
    .eq("instance_id", instance.id)
    .single();
  if (!secret) {
    throw new InstanceResolutionError("token da instância não encontrado", 404);
  }

  return { instanceId: instance.id as string, token: secret.uazapi_token as string };
}
