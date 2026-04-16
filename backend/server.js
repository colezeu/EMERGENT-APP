import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ai-consultant", async (req, res) => {
  try {
    const { productType, message, currentConfig, conversation } = req.body || {};

    const systemPrompt = `
Ești un consultant comercial pentru produse din sticlă.
Ajută clientul să aleagă produsul potrivit și să completeze configuratorul.

Reguli:
- NU calcula prețuri.
- NU inventa reguli tehnice.
- Răspunde scurt și clar.
- Dacă lipsesc date, cere clarificări.
- Returnează EXCLUSIV JSON valid.

Schema:
{
  "reply": "string",
  "missingFields": ["string"],
  "confidence": 0.0,
  "prefill": {
    "product": "string|null",
    "subtype": "string|null",
    "width": "number|null",
    "height": "number|null",
    "glassType": "string|null",
    "glassThickness": "string|null",
    "hardwareFinish": "string|null",
    "extras": {}
  }
}
`;

    const ollamaRes = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              productType,
              message,
              currentConfig,
              conversation,
            }),
          },
        ],
        options: {
          temperature: 0.2,
        },
        keep_alive: "10m",
      }),
    });

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text();
      return res.status(500).json({ error: text });
    }

    const data = await ollamaRes.json();
    const content = data?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        reply: "Am înțeles parțial cererea, dar nu am putut structura complet datele.",
        missingFields: [],
        confidence: 0.3,
        prefill: {},
      };
    }

    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
