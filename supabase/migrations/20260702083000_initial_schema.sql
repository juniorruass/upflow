-- Identidade e organização

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'active' check (status in ('active', 'suspended', 'trial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1:1 com auth.users. Aqui mora o role -- nunca em auth.users.raw_user_meta_data,
-- que é editável pelo próprio usuário via client SDK.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade, -- NULL para upflu_admin
  role text not null check (role in ('upflu_admin', 'client_user')),
  full_name text,
  created_at timestamptz not null default now()
);

-- Instâncias WhatsApp (uazapiGO)

create table whatsapp_instances (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  uazapi_name text not null,
  status text not null default 'disconnected'
    check (status in ('disconnected', 'connecting', 'connected', 'hibernated')),
  phone_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, uazapi_name)
);

-- Token da instância fica separado: nunca é exposto via SELECT liberado por RLS,
-- só acessível via service role (ver policies na migration seguinte).
create table whatsapp_instance_secrets (
  instance_id uuid primary key references whatsapp_instances(id) on delete cascade,
  uazapi_token text not null
);

-- CRM / Kanban

create table contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  instance_id uuid references whatsapp_instances(id) on delete set null,
  wa_id text not null,
  name text,
  avatar_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, wa_id)
);

create table kanban_stages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  position int not null,
  color text,
  created_at timestamptz not null default now()
);

create table kanban_cards (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  stage_id uuid not null references kanban_stages(id) on delete restrict,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contact_id)
);

-- Fluxo de chatbot: metadata relacional + grafo (nodes/edges) como JSONB,
-- compatível com o formato do React Flow.

create table chatbot_flows (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  instance_id uuid references whatsapp_instances(id) on delete set null,
  name text not null default 'Fluxo principal',
  is_active boolean not null default false,
  definition jsonb not null default '{"nodes": [], "edges": []}'::jsonb,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Runtime: em que node do fluxo cada contato está.
create table chatbot_conversation_state (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  flow_id uuid not null references chatbot_flows(id) on delete cascade,
  current_node_id text,
  updated_at timestamptz not null default now(),
  unique (contact_id, flow_id)
);
