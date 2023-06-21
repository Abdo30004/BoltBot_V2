import { Event } from "../../interfaces/event";
import { Chat } from "whatsapp-web.js";
const event: Event = {
  name: "chat_removed",
  run: async (client, chat: Chat) => {
    client.cache.chats.delete(chat.id._serialized);
  },
};

export default event;
