import { useState } from "react";

export default function AIConsultant({
  productType,
  currentConfig,
  onApplyPrefill,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Salut! Te ajut să alegi produsul potrivit și să completezi configuratorul. Spune-mi ce dorești.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPrefill, setLastPrefill] = useState(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType,
          message: text,
          currentConfig,
          conversation: nextMessages,
        }),
      });

      if (!res.ok) {
        throw new Error("Eroare la consultantul AI.");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Am analizat cererea.",
        },
      ]);

      setLastPrefill(data.prefill || null);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "A apărut o problemă la procesare. Te rog încearcă din nou.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function applyPrefill() {
    if (!lastPrefill) return;
    onApplyPrefill(lastPrefill);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">Consultant AI</h3>
        <p className="text-sm text-gray-500">
          Te ajută să alegi și să completezi configuratorul.
        </p>
      </div>

      <div className="mb-3 h-80 overflow-y-auto rounded-xl bg-gray-50 p-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-black text-white"
                : "bg-white border text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-white border text-gray-800">
            Se analizează cererea...
          </div>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full rounded-xl border p-3 text-sm outline-none"
          rows={4}
          placeholder="Ex: Vreau o cabină de duș minimalistă, 120x200, sticlă clară, negru mat."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Trimite
          </button>

          <button
            onClick={applyPrefill}
            disabled={!lastPrefill}
            className="rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Aplică în configurator
          </button>
        </div>
      </div>
    </div>
  );
}
