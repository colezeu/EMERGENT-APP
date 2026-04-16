import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai-consultant", async (req, res) => {
  try {
    const { message } = req.body;

    // TEST simplu (fără AI momentan)
    return res.json({
      reply: "Am primit mesajul: " + message,
      prefill: {
        width: 1200,
        height: 2000,
        glassType: "clear",
        hardwareFinish: "black",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
