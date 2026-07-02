@AGENTS.md

# UpFlow

> Projeto criado em 02/07/2026. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

Plataforma própria de automação e CRM para WhatsApp (estilo Leona Flow + Zapdata): fluxos de chatbot com menus interativos e CRM kanban, integrada à UazAPI, pra ser vendida como produto da Upflu pro mesmo público-alvo (barbearias, clínicas, advogados, restaurantes, imobiliárias).

## Tipo

Projeto interno / produto próprio.

## Stack

Next.js (App Router, TS, Tailwind) + Supabase. Scaffold criado em 02/07/2026 via create-next-app.

## Entregas previstas

**MVP (fase 1):**
- Conexão de instância WhatsApp via UazAPI (QR code, status)
- Construtor de fluxo de chatbot (mensagens automáticas + menus/botões)
- CRM kanban básico

**Fase 2 (depois de validar o MVP):**
- Distribuição automática de leads entre atendentes
- Notificações personalizadas por ação do cliente
- Disparos em massa segmentados
- IA lendo conversa e preenchendo funil automaticamente
- Painéis de métricas

## Onde salvar o que

- Briefing e contexto: `briefing.md` nessa pasta
- Código: `src/` (App Router)

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz, marca e contexto do negócio definidos em `_memoria/` e `identidade/` da raiz. Não duplicar essas informações aqui.

## Específico desse projeto

- Integração WhatsApp é via **UazAPI**, diferente dos demais projetos da Upflu que usam Evolution API v2.3.7 (ver `_memoria/evolution-api.md`). Não confundir as duas ao configurar webhooks/credenciais.
- Chaves UazAPI usadas em dev são de conta de teste (validade curta, ~1h por token) — não assumir que ficam válidas entre sessões.
- Escopo do MVP é enxuto de propósito — não implementar itens da fase 2 antes do MVP estar validado.
