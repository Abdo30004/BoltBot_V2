import { Event } from "../interfaces/event";
import { GroupChat } from "whatsapp-web.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const event: Event = {
  name: "ready",
  once: false,
  run: async (client) => {
    let groups = (await client.getChats()).filter(
      (chat) => chat.isGroup
    ) as GroupChat[];
    for (let i = 0; i < groups.length; i++) {
      await sleep(2 * 1000);
      await groups[i].leave();
      console.log(`Left ${groups[i].name} ${i + 1}/${groups.length}`);
    }
  },
};

export default event;
