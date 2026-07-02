"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "connecting" | "connected" | "error";

export default function ConnectPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startConnection() {
    setStatus("connecting");
    setError(null);
    try {
      const connectRes = await fetch("/api/instance/connect", { method: "POST" });
      const connectData = await connectRes.json();
      if (!connectRes.ok) throw new Error(connectData.error);
      setQrcode(connectData.instance?.qrcode ?? null);

      pollRef.current = setInterval(async () => {
        const statusRes = await fetch("/api/instance/status");
        const statusData = await statusRes.json();
        if (statusData.instance?.qrcode) setQrcode(statusData.instance.qrcode);
        if (statusData.status?.connected) {
          setStatus("connected");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-6 py-32 px-8 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Conectar WhatsApp
        </h1>

        {status === "idle" && (
          <button
            onClick={startConnection}
            className="rounded-full bg-foreground px-6 py-3 text-background font-medium"
          >
            Gerar QR code
          </button>
        )}

        {status === "connecting" && qrcode && (
          <>
            <img src={qrcode} alt="QR code do WhatsApp" width={280} height={280} />
            <p className="text-sm text-zinc-500">Escaneie no WhatsApp para conectar.</p>
          </>
        )}

        {status === "connecting" && !qrcode && <p>Gerando QR code...</p>}

        {status === "connected" && (
          <p className="text-lg font-medium text-green-600">✓ Conectado com sucesso!</p>
        )}

        {status === "error" && <p className="text-sm text-red-600">Erro: {error}</p>}
      </main>
    </div>
  );
}
