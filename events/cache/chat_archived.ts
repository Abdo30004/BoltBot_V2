import { Event } from "../../interfaces/event";
import { Chat } from "whatsapp-web.js";
const event: Event = {
  name: "chat_archived",
  run: async (client, chat: Chat) => {
    client.cache.chats.set(chat.id._serialized, chat);
  },
};

export default event;
