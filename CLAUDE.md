@AGENTS.md

# UpFlow

> Projeto criado em 02/07/2026. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

Plataforma própria de automação e CRM para WhatsApp (estilo Leona Flow + Zapdata): fluxos de chatbot com menus interativos e CRM kanban, integrada à UazAPI, pra ser vendida como produto da Upflu pro mesmo público-alvo (barbearias, clínicas, advogados, restaurantes, imobiliárias).

## Tipo

Projeto interno / produto próprio.

## Stack

Next.js 16 (App Router, TS, Tailwind) + Supabase (projeto `upflow`, ref `rslvkoospgdvinnfjfrp`, org `agupflu@gmail.com's Org`). Modelo multi-tenant: painel Admin (Upflu gerencia todos os clientes) + painel Cliente (cada cliente vê só o seu). Arquitetura completa documentada em `C:\Users\junio\.claude\plans\stateful-bouncing-allen.md`.

## Status (02/07/2026)

Fundação multi-tenant implementada e testada de ponta a ponta (E2E via Playwright): login → admin cria cliente novo (provisiona `auth.users` + `profiles` + instância real na uazapiGO) → cliente loga → gera QR code real. Ver seção "Arquitetura implementada" abaixo.

## Entregas previstas

**MVP (fase 1):**
- ✅ Fundação multi-tenant (Supabase + auth + RLS + painel admin/cliente)
- ✅ Provisionamento de cliente (admin cria → instância uazapiGO real criada)
- ✅ Conexão de instância WhatsApp via UazAPI (QR code, status) — autenticado, token nunca exposto ao browser
- ⬜ Construtor de fluxo de chatbot (mensagens automáticas + menus/botões)
- ⬜ CRM kanban básico (tabelas já existem: `kanban_stages`, `kanban_cards`)

**Fase 2 (depois de validar o MVP):**
- Distribuição automática de leads entre atendentes
- Notificações personalizadas por ação do cliente
- Disparos em massa segmentados
- IA lendo conversa e preenchendo funil automaticamente
- Painéis de métricas
- Cobrança/planos (explicitamente adiado pelo usuário até testar o resto)

## Arquitetura implementada

- **Banco (Supabase):** `clients`, `profiles` (role: `upflu_admin`|`client_user`), `whatsapp_instances`, `whatsapp_instance_secrets` (token isolado, só service role lê), `contacts`, `kanban_stages`, `kanban_cards`, `chatbot_flows` (definition em JSONB, formato React Flow), `chatbot_conversation_state`. RLS por `client_id` em todas, funções helper `auth_client_id()` e `is_upflu_admin()`. Migrations em `supabase/migrations/`.
- **Rotas:** `(admin)/admin/*` (dashboard, criar cliente) e `(client)/app/*` (dashboard, `/connect`), cada route group com `layout.tsx` checando role + redirect. `src/proxy.ts` (Next 16 renomeou `middleware.ts` → `proxy.ts`) cuida do refresh de sessão.
- **Provisionamento:** `POST /api/admin/clients` roda a saga completa (cria client, cria auth user com senha temporária retornada na resposta — sem SMTP configurado ainda, admin repassa manualmente —, chama `createInstance` da uazapiGO com admintoken, salva token em `whatsapp_instance_secrets`, seed de kanban stages).
- **Conexão:** `api/instance/{connect,status}` resolvem o token da instância via sessão do usuário (nunca mais aceitam token do browser como na primeira versão de teste).
- `src/lib/uazapi.ts` só é importado por `api/admin/**` (admintoken) e por `src/lib/instance.ts` (resolve token de instância via service role).

## Onde salvar o que

- Briefing e contexto: `briefing.md` nessa pasta
- Código: `src/` (App Router)

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz, marca e contexto do negócio definidos em `_memoria/` e `identidade/` da raiz. Não duplicar essas informações aqui.

## Específico desse projeto

- Integração WhatsApp é via **UazAPI**, diferente dos demais projetos da Upflu que usam Evolution API v2.3.7 (ver `_memoria/evolution-api.md`). Não confundir as duas ao configurar webhooks/credenciais.
- Chaves UazAPI usadas em dev são de conta de teste (validade curta, ~1h por token) — não assumir que ficam válidas entre sessões.
- Escopo do MVP é enxuto de propósito — não implementar itens da fase 2 antes do MVP estar validado.
