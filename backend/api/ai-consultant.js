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
