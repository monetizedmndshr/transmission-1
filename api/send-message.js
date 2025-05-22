const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

module.exports = async (req, res) => {
    const { message, username } = req.body;
  
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
  
    await pusher.trigger("presence-chat", "chat-event", { message, username });
    res.status(200).json({ success: true });
  };
