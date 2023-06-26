import { Event } from "../interfaces/event";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const event: Event = {
  name: "ready",
  once: false,
  run: async (client) => {
    let chats = await client.getChats();
    for (let i = 0; i < chats.length; i++) {
      await sleep;
      250;
      await chats[i].delete();
      console.log(`deleted ${chats[i]?.name} ${i + 1}/${chats.length}`);
    }
  },
};

export default event;
