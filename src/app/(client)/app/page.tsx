import Link from "next/link";

export default function ClientDashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">UpFlow</h1>
      <nav className="flex gap-4">
        <Link href="/app/connect" className="underline">
          Conectar WhatsApp
        </Link>
      </nav>
    </main>
  );
}
