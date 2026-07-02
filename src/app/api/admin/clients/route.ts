import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInstance } from "@/lib/uazapi";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: requesterProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (requesterProfile?.role !== "upflu_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { name, slug, email } = await req.json();
  if (!name || !slug || !email) {
    return NextResponse.json({ error: "faltando name, slug ou email" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: client, error: clientError } = await admin
    .from("clients")
    .insert({ name, slug })
    .select()
    .single();
  if (clientError) {
    return NextResponse.json({ error: clientError.message }, { status: 400 });
  }

  const tempPassword = randomBytes(9).toString("base64url");
  const { data: createdUser, error: userError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });
  if (userError || !createdUser.user) {
    return NextResponse.json({ error: userError?.message, client }, { status: 400 });
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: createdUser.user.id,
    client_id: client.id,
    role: "client_user",
  });
  if (profileError) {
    return NextResponse.json({ error: profileError.message, client }, { status: 400 });
  }

  await admin.from("kanban_stages").insert([
    { client_id: client.id, name: "Novo lead", position: 0 },
    { client_id: client.id, name: "Em atendimento", position: 1 },
    { client_id: client.id, name: "Fechado", position: 2 },
  ]);

  try {
    const uazapiData = await createInstance(slug);

    const { data: instance, error: instError } = await admin
      .from("whatsapp_instances")
      .insert({ client_id: client.id, uazapi_name: slug, status: "disconnected" })
      .select()
      .single();
    if (instError) throw new Error(instError.message);

    const { error: secretError } = await admin
      .from("whatsapp_instance_secrets")
      .insert({ instance_id: instance.id, uazapi_token: uazapiData.token });
    if (secretError) throw new Error(secretError.message);

    await admin.from("chatbot_flows").insert({
      client_id: client.id,
      instance_id: instance.id,
      name: "Fluxo principal",
    });

    return NextResponse.json({ client, instance, tempPassword });
  } catch (err) {
    return NextResponse.json(
      {
        warning: `Cliente e login criados, mas falhou o provisionamento da instância uazapiGO: ${(err as Error).message}. Pode tentar reprovisionar depois.`,
        client,
        tempPassword,
      },
      { status: 207 }
    );
  }
}
