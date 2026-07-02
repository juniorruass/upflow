"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Stage = { id: string; name: string; position: number };
type Contact = { id: string; name: string | null; wa_id: string };
type Card = { id: string; stage_id: string; position: number; contact: Contact | null };

export default function KanbanBoard({
  clientId,
  initialStages,
  initialCards,
}: {
  clientId: string;
  initialStages: Stage[];
  initialCards: Card[];
}) {
  const [stages] = useState(initialStages);
  const [cards, setCards] = useState(initialCards);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [waId, setWaId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const firstStage = stages[0];

    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .insert({ client_id: clientId, name: name || null, wa_id: waId })
      .select()
      .single();

    if (contactError || !contact) {
      setError(contactError?.message ?? "erro ao criar contato");
      setSaving(false);
      return;
    }

    const { data: card, error: cardError } = await supabase
      .from("kanban_cards")
      .insert({
        client_id: clientId,
        contact_id: contact.id,
        stage_id: firstStage.id,
        position: cards.filter((c) => c.stage_id === firstStage.id).length,
      })
      .select("id, stage_id, position, contact:contacts(id, name, wa_id)")
      .single();

    setSaving(false);
    if (cardError || !card) {
      setError(cardError?.message ?? "erro ao criar card");
      return;
    }

    setCards((prev) => [
      ...prev,
      { ...card, contact: Array.isArray(card.contact) ? card.contact[0] : card.contact },
    ]);
    setName("");
    setWaId("");
    setShowForm(false);
  }

  async function moveCard(cardId: string, newStageId: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, stage_id: newStageId } : c))
    );
    const supabase = createClient();
    await supabase.from("kanban_cards").update({ stage_id: newStageId }).eq("id", cardId);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">CRM</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Novo contato
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddContact} className="flex flex-wrap items-end gap-3">
          <input
            placeholder="Nome (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
          />
          <input
            placeholder="Número WhatsApp (ex: 5511999999999)"
            value={waId}
            onChange={(e) => setWaId(e.target.value)}
            required
            className="rounded-md border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Adicionar"}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-1 gap-4 overflow-x-auto">
        {stages.map((stage) => (
          <div
            key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const cardId = e.dataTransfer.getData("text/card-id");
              if (cardId) moveCard(cardId, stage.id);
            }}
            className="flex w-72 flex-shrink-0 flex-col gap-3 rounded-lg border border-black/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-900"
          >
            <h2 className="font-medium">{stage.name}</h2>
            <div className="flex flex-col gap-2">
              {cards
                .filter((c) => c.stage_id === stage.id)
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/card-id", card.id)}
                    className="cursor-grab rounded-md border border-black/10 bg-white p-3 text-sm shadow-sm dark:border-white/10 dark:bg-black"
                  >
                    <p className="font-medium">{card.contact?.name || card.contact?.wa_id}</p>
                    {card.contact?.name && (
                      <p className="text-xs text-zinc-500">{card.contact.wa_id}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
