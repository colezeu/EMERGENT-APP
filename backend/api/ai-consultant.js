export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { productType, message, currentConfig, conversation } = req.body || {};

    const systemPrompt = `
Ești un consultant comercial pentru produse din sticlă.
Rolul tău este să ajuți clientul să aleagă produsul potrivit și să completeze configuratorul.

Reguli:
- NU calcula prețuri.
- NU inventa reguli tehnice.
- NU afirma cu certitudine lucruri structurale dacă lipsesc date.
- Răspunde scurt, clar, politicos.
- Extrage doar valori utile pentru configurator.
- Dacă lipsesc date importante, cere clarificări.
- Returnează EXCLUSIV JSON valid.

Schema JSON:
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

    const userPayload = {
      productType,
      currentConfig,
      conversation,
      latestUserMessage: message,
    };

    const response = await fetch(process.env.AI_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        reply: "Am înțeles cererea, dar nu am putut structura complet datele.",
        missingFields: [],
        confidence: 0.3,
        prefill: {},
      };
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
