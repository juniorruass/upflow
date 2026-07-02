const BASE_URL = process.env.UAZAPI_BASE_URL ?? "";
const ADMIN_TOKEN = process.env.UAZAPI_ADMIN_TOKEN ?? "";

async function uazapiFetch(path: string, init: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? data?.error ?? `UazAPI error ${res.status}`);
  }
  return data;
}

export function createInstance(name: string) {
  return uazapiFetch("/instance/create", {
    method: "POST",
    headers: { admintoken: ADMIN_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export function connectInstance(instanceToken: string, phone?: string) {
  return uazapiFetch("/instance/connect", {
    method: "POST",
    headers: { token: instanceToken, "Content-Type": "application/json" },
    body: JSON.stringify(phone ? { phone } : {}),
  });
}

export function getInstanceStatus(instanceToken: string) {
  return uazapiFetch("/instance/status", {
    method: "GET",
    headers: { token: instanceToken },
  });
}

export function sendText(instanceToken: string, number: string, text: string) {
  return uazapiFetch("/send/text", {
    method: "POST",
    headers: { token: instanceToken, "Content-Type": "application/json" },
    body: JSON.stringify({ number, text }),
  });
}
