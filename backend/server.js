import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/ai-consultant", async (req, res) => {
  try {
    const { productType, message, currentConfig, conversation } = req.body || {};

    const systemPrompt = `
Ești un consultant comercial pentru configuratorul de cabine duș Glass Associates.

Rol:
- ajuți clientul să aleagă produsul potrivit
- extragi valori pentru configurator
- NU calculezi prețuri
- NU inventezi reguli tehnice

Trebuie să returnezi EXCLUSIV JSON valid, în schema:

{
  "reply": "string",
  "missingFields": ["string"],
  "confidence": 0.0,
  "prefill": {
    "width": "number|null",
    "depth": "number|null",
    "height": "number|string|null",
    "enclosure": "paravan-fix-profil|paravan-fix-punctual|paravan-mobil|usa-batanta|usa-culisanta-vedere|usa-culisanta-sina|null",
    "glassType": "8mm|10mm|null",
    "treatment": "clear|frosted|nano|null",
    "options": {
      "towelBar": false,
      "seat": false,
      "led": false
    }
  }
}

Reguli de interpretare:
- dacă utilizatorul spune 120x90, interpretează width=1.2 și depth=0.9
- dacă spune înălțime 2 metri, height="2.0"
- "ușor de curățat" sugerează treatment="nano"
- "opac" sau "intimitate" sugerează treatment="frosted"
- pentru cabină standard elegantă, poți sugera "usa-batanta"
- dacă lipsesc dimensiuni, cere clarificări
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
});
