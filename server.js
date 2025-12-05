const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawnSync } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/analyze", (req, res) => {
  const { sender, subject, body } = req.body;

  if (!sender || !subject || !body) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const prompt = `
You are an email phishing detection AI.

Your job is to classify an email as:
- LOW RISK → normal email, no phishing indicators
- MEDIUM RISK → mildly suspicious
- HIGH RISK → clear phishing attempt

Be strict ONLY when REAL red flags exist.

Return JSON ONLY in this exact format:

{
  "risk": "LOW" | "MEDIUM" | "HIGH",
  "summary": "short explanation",
  "red_flags": ["list", "of", "issues"]
}

Rules:
- If the email looks normal (invoice, HR notice, order confirmation), label it LOW.
- Do NOT invent red flags.
- Only classify as HIGH when there is strong evidence (urgent money requests, strange links, threats, unverified sender, password resets not requested).
- If email is unclear, choose MEDIUM.

Email:
Sender: ${sender}
Subject: ${subject}
Body: ${body}
`;

  try {
    // WINDOWS SAFE: send prompt via stdin (input)
    const result = spawnSync("ollama", ["run", "llama2"], {
      input: prompt,
      encoding: "utf8"
    });

    if (result.error) {
      console.error("Ollama Exec Error:", result.error);
      return res.status(500).json({ error: "Ollama execution failed" });
    }

    const output = result.stdout.trim();
    console.log("Ollama Output:", output);

    // Extract JSON from model output
    let data;
    try {
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      data = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("JSON parse failed:", err.message);

      // Fallback
      return res.json({
        risk: "SUSPICIOUS",
        red_flags: ["AI failed to generate structured JSON"],
        summary: output
      });
    }

    return res.json(data);

  } catch (err) {
    console.error("Fatal backend error:", err);
    return res.status(500).json({ error: "Failed to analyze email" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://127.0.0.1:${PORT}`);
});
