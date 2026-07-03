export type ConnectionStatus = "connected" | "disconnected" | "connecting";

export interface DashboardData {
  connection: { status: ConnectionStatus; phoneNumber: string };
  metrics: {
    automatedMessagesToday: number;
    responseRate: number; // 0-100
    activeConversations: number;
    waitingForHuman: number;
  };
  flows: Array<{
    id: string;
    name: string;
    active: boolean;
    triggerCount: number;
    periodLabel: string;
    sparklineData: number[];
  }>;
  recentConversations: Array<{
    id: string;
    contactName: string;
    lastMessagePreview: string;
    status: "bot" | "human";
    timeAgo: string;
  }>;
}

const mockDashboardData: DashboardData = {
  connection: { status: "connected", phoneNumber: "+55 73 9•••• -4821" },
  metrics: {
    automatedMessagesToday: 342,
    responseRate: 94,
    activeConversations: 18,
    waitingForHuman: 3,
  },
  flows: [
    {
      id: "flow-boas-vindas",
      name: "Boas-vindas + menu",
      active: true,
      triggerCount: 128,
      periodLabel: "7 dias",
      sparklineData: [4, 8, 6, 12, 9, 15, 11],
    },
    {
      id: "flow-agendamento",
      name: "Agendamento de horário",
      active: true,
      triggerCount: 76,
      periodLabel: "7 dias",
      sparklineData: [2, 3, 5, 4, 8, 6, 9],
    },
    {
      id: "flow-pos-atendimento",
      name: "Pesquisa pós-atendimento",
      active: false,
      triggerCount: 0,
      periodLabel: "7 dias",
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
    },
  ],
  recentConversations: [
    {
      id: "conv-1",
      contactName: "Mariana Alves",
      lastMessagePreview: "Preciso falar com alguém, o horário não bateu",
      status: "human",
      timeAgo: "2 min",
    },
    {
      id: "conv-2",
      contactName: "Carlos Eduardo",
      lastMessagePreview: "Quero remarcar pra sexta-feira",
      status: "human",
      timeAgo: "9 min",
    },
    {
      id: "conv-3",
      contactName: "Fernanda Lima",
      lastMessagePreview: "Perfeito, obrigada!",
      status: "bot",
      timeAgo: "23 min",
    },
    {
      id: "conv-4",
      contactName: "João Pedro",
      lastMessagePreview: "Qual o valor do corte + barba?",
      status: "bot",
      timeAgo: "1h",
    },
    {
      id: "conv-5",
      contactName: "Beatriz Souza",
      lastMessagePreview: "Confirmado! Até amanhã",
      status: "bot",
      timeAgo: "2h",
    },
  ],
};

// Isolado como uma função assíncrona já hoje para poder virar um fetch
// (API route/server action) sem precisar tocar nos componentes que a consomem.
export async function getDashboardData(): Promise<DashboardData> {
  return mockDashboardData;
}

// Simula PATCH /api/flows/[id]. Troca pelo fetch real no futuro sem mexer
// em quem chama -- o contrato (Promise que rejeita em caso de erro) já é o mesmo.
export async function updateFlowActive(id: string, active: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const flow = mockDashboardData.flows.find((f) => f.id === id);
  if (flow) flow.active = active;
}
