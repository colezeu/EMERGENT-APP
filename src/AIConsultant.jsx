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
        "Salut! Spune-mi ce tip de cabină dorești, ce dimensiuni aproximative ai și ce stil preferi.",
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
      const res = await fetch("http://localhost:3001/ai-consultant", {
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
        throw new Error("Eroare la consultantul AI");
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
            "A apărut o problemă la comunicarea cu serverul local AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
}
