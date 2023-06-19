import { Command } from "../../interfaces/command";
import { GroupChat } from "whatsapp-web.js";
const command: Command = {
  name: "mention",
  aliases: ["mentions", "mentionAll", "منشن", "منشنات", "منشن-الكل","m"],
  category: "groups",
  adminOnly: true,
  groupOnly: true,

  execute: async (client, message, commandTanslate) => {
    let chat = (await message.getChat()) as GroupChat;
    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `${!text ? "" : "\n"}-@${participant.id.user}`;
    }
    await message.reply(text, chat.id._serialized, {
      mentions: mentions,
    });

    return true;
  },
};

export default command;
