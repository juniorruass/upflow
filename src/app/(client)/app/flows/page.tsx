import { getDashboardData } from "@/lib/mock-data/dashboard";
import FlowsGrid from "@/components/dashboard/FlowsGrid";

export default async function FlowsPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Fluxos</h1>
      <FlowsGrid initialFlows={data.flows} />
    </main>
  );
}
