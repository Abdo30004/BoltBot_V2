import { Event } from "../interfaces/event";
import { Call } from "whatsapp-web.js";
const event: Event = {
  name: "call",
  run: async (client, call: Call) => {
    call.reject();
  },
};

export default event;
