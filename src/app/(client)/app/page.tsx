"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import ConnectionStatusCard from "@/components/dashboard/ConnectionStatusCard";
import MetricCard from "@/components/dashboard/MetricCard";
import FlowsGrid from "@/components/dashboard/FlowsGrid";
import RecentConversations from "@/components/dashboard/RecentConversations";
import { useConnectionStatus } from "@/lib/hooks/useConnectionStatus";
import { getDashboardData, type DashboardData } from "@/lib/mock-data/dashboard";

export default function ClientDashboard() {
  const connection = useConnectionStatus();
  const [data, setData] = useState<DashboardData | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!connection || !data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-text-dim">Carregando...</p>
      </main>
    );
  }

  const blockVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.4,
        delay: reduceMotion ? 0 : i * 0.05,
        ease: "easeOut",
      },
    }),
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={blockVariants}
        className="grid grid-cols-1 gap-4 lg:grid-cols-4"
      >
        <ConnectionStatusCard status={connection.status} phoneNumber={connection.phoneNumber} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
          <MetricCard label="Mensagens automatizadas hoje" value={data.metrics.automatedMessagesToday} />
          <MetricCard label="Taxa de resposta" value={data.metrics.responseRate} suffix="%" />
          <MetricCard
            label="Conversas ativas"
            value={data.metrics.activeConversations}
            delta={
              data.metrics.waitingForHuman > 0
                ? {
                    value: `${data.metrics.waitingForHuman} aguardando humano`,
                    direction: "neutral",
                    tone: "warning",
                  }
                : undefined
            }
          />
        </div>
      </motion.section>

      <motion.section custom={1} initial="hidden" animate="visible" variants={blockVariants}>
        <h2 className="mb-3 font-display text-lg font-semibold text-text-primary">Fluxos</h2>
        <FlowsGrid initialFlows={data.flows} />
      </motion.section>

      <motion.section custom={2} initial="hidden" animate="visible" variants={blockVariants}>
        <RecentConversations conversations={data.recentConversations} />
      </motion.section>
    </main>
  );
}
