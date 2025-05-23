import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
    // Pusher sends auth requests as form‐encoded, not JSON
    const body = await req.text();
    const params = new URLSearchParams(body);
    const socket_id = params.get("socket_id");
    const channel_name = params.get("channel_name");
    const username = params.get("username");
  
     const auth = pusher.authenticate(socket_id, channel_name, {
       user_id: username,
       user_info: { username },
     });
     return new Response(JSON.stringify(auth), {
       status: 200,
       headers: { "Content-Type": "application/json" },
     });
  }