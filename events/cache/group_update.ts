import { Event } from "../../interfaces/event";
import { GroupNotification } from "whatsapp-web.js";
const event: Event = {
  name: "group_update",
  run: async (client, notification: GroupNotification) => {
    let chat = await notification.getChat();
    client.cache.chats.set(chat.id._serialized, chat);
  },
};

export default event;
