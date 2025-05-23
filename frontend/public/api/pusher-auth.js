const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

module.exports = async (req, res) => {
  const { socket_id, channel_name, username } = req.body;

  const presenceData = {
    user_id: username,
    user_info: { username }
  };

  const auth = pusher.authenticate(socket_id, channel_name, presenceData);
  res.send(auth);
};
