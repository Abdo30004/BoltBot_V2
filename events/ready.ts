import Client from "../base/client";
import { Event } from "../interfaces/event";

const event: Event = {
  name: "ready",
  once: false,
  run: async (client: Client) => {
    console.log(`Logged in as ${client.info.pushname}`);
  },
};

export default event;
