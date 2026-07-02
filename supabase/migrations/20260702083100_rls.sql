-- Funções helper. security definer é necessário para evitar recursão infinita
-- de RLS ao consultar `profiles` dentro de uma policy que também está sujeita a RLS.

create or replace function auth_client_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select client_id from profiles where id = auth.uid()
$$;

create or replace function is_upflu_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'upflu_admin'
  )
$$;

-- clients: client_user só lê a própria linha; upflu_admin lê/edita tudo.

alter table clients enable row level security;

create policy "clients: select own or admin"
  on clients for select
  using (id = auth_client_id() or is_upflu_admin());

create policy "clients: admin manages"
  on clients for all
  using (is_upflu_admin())
  with check (is_upflu_admin());

-- profiles: cada usuário lê o próprio perfil; upflu_admin lê/edita todos.
-- Provisionamento (criação de profiles) roda via service role, que bypassa RLS.

alter table profiles enable row level security;

create policy "profiles: select own or admin"
  on profiles for select
  using (id = auth.uid() or is_upflu_admin());

create policy "profiles: admin manages"
  on profiles for all
  using (is_upflu_admin())
  with check (is_upflu_admin());

-- Tabelas de cliente: isolamento padrão por client_id, com bypass para upflu_admin.

alter table whatsapp_instances enable row level security;
create policy "client isolation"
  on whatsapp_instances for all
  using (client_id = auth_client_id() or is_upflu_admin())
  with check (client_id = auth_client_id() or is_upflu_admin());

alter table contacts enable row level security;
create policy "client isolation"
  on contacts for all
  using (client_id = auth_client_id() or is_upflu_admin())
  with check (client_id = auth_client_id() or is_upflu_admin());

alter table kanban_stages enable row level security;
create policy "client isolation"
  on kanban_stages for all
  using (client_id = auth_client_id() or is_upflu_admin())
  with check (client_id = auth_client_id() or is_upflu_admin());

alter table kanban_cards enable row level security;
create policy "client isolation"
  on kanban_cards for all
  using (client_id = auth_client_id() or is_upflu_admin())
  with check (client_id = auth_client_id() or is_upflu_admin());

alter table chatbot_flows enable row level security;
create policy "client isolation"
  on chatbot_flows for all
  using (client_id = auth_client_id() or is_upflu_admin())
  with check (client_id = auth_client_id() or is_upflu_admin());

alter table chatbot_conversation_state enable row level security;
create policy "client isolation"
  on chatbot_conversation_state for all
  using (client_id = auth_client_id() or is_upflu_admin())
  with check (client_id = auth_client_id() or is_upflu_admin());

-- whatsapp_instance_secrets: RLS habilitada sem nenhuma policy para
-- authenticated/anon -- só o service role (que bypassa RLS por padrão) acessa.
alter table whatsapp_instance_secrets enable row level security;
