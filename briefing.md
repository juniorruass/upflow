# Briefing — UpFlow

**Data:** 02/07/2026

## O que é

Produto próprio da Upflu: plataforma de automação e CRM para WhatsApp, inspirada no Leona Flow e no Zapdata. Objetivo é vender como SaaS pra empresas locais (mesmo público-alvo da Upflu: barbearias, clínicas, advogados, restaurantes, imobiliárias).

## Referências

**Leona Flow** — automação de atendimento + CRM:
- Automação de mensagens (boas-vindas, respostas padrão, encerramento)
- Menus e botões interativos no WhatsApp
- Distribuição automática e igualitária de leads entre atendentes
- Notificações personalizadas por ação do cliente (ex: pediu PIX)

**Zapdata** — marketing digital + vendas via WhatsApp:
- IA lendo conversas, processando pedidos, capturando dados (endereço), preenchendo funil automaticamente
- CRM visual estilo Kanban (tipo Trello)
- Disparos em massa segmentados (por grupo/etiqueta)
- Integração com logística
- Painéis de métricas e desempenho de criativos

## Integração WhatsApp

UazAPI (a definir instância/conta — projetos atuais da Upflu como clinica-sistema usam Evolution API v2.3.7 na VPS OVH; UpFlow usa UazAPI por decisão do usuário, verificar se é conta própria ou reaproveitamento).

## Escopo do MVP (fase 1)

1. Conexão de instância WhatsApp via UazAPI (QR code, status da conexão)
2. Construtor de fluxo de chatbot: mensagens automáticas (boas-vindas/encerramento) + menus/botões interativos
3. CRM kanban básico: contatos organizados em colunas/etapas

## Fora do MVP (fase 2, depois de validar)

- Distribuição automática de leads entre atendentes
- Notificações personalizadas por ação do cliente
- Disparos em massa segmentados
- IA lendo conversa e preenchendo funil automaticamente
- Painéis de métricas

## Tipo

Projeto interno / produto próprio (como autik-lives, tiktok-flow-extension).
