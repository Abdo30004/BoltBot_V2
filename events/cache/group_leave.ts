import { Event } from "../../interfaces/event";
import { GroupNotification } from "whatsapp-web.js";
const event: Event = {
  name: "group_leave",
  run: async (client, notification: GroupNotification) => {
    let chat = await notification.getChat();
    client.cache.chats.delete(chat.id._serialized);
  },
};

export default event;
