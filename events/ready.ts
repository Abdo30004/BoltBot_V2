import Client from "../base/client";
import { Event } from "../interfaces/event";


const event: Event = {
  name: "ready",
  once: false,
  run: async (client: Client) => {
    client.uptime = Date.now();
    console.log(`Logged in as ${client.info.pushname}`);
    client
      .sendMessage(client.config.test, "*Bolt Bot* ⚡ Started 🟢")
      .catch(() => null);
  },
};

export default event;
