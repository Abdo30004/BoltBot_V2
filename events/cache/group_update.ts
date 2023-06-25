import { Event } from "../../interfaces/event";
import { GroupNotification, GroupChat } from "whatsapp-web.js";
const event: Event = {
  name: "group_update",
  run: async (client, notification: GroupNotification) => {
  let chat = (await notification.getChat()) as GroupChat;
  await chat.leave();
  },
};

export default event;
