const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("✅ Triggering message:", message); // <-- add this
    await pusher.trigger("chat-channel", "chat-event", { message });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Pusher trigger error:", error); // <-- capture full error
    res.status(500).json({ error: "Failed to send message" });
  }
};
