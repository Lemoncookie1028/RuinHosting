export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { botName } = req.body;

  if (!botName) {
    return res.status(400).json({ error: "Missing botName" });
  }

  try {
    // FORWARD TO YOUR HOME PC
    const forward = await fetch("http://127.0.0.1:8080/create-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botName })
    });

    const data = await forward.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Could not reach your PC server. Is it running?",
      details: err.toString()
    });
  }
}
