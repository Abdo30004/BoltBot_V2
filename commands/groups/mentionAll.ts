import { Command } from "../../interfaces/command";
import { GroupChat } from "whatsapp-web.js";
const command: Command = {
  name: "mention",
  aliases: ["mentions", "mentionAll", "منشن", "منشنات", "منشن-الكل"],
  category: "groups",
  adminOnly: true,
  groupOnly: true,

  execute: async (client, message, commandTanslate) => {
    const chat = (await message.getChat()) as GroupChat;
    let text = chat.participants
      .map((participant) => `${participant.id.user}`)
      .join("\n");
    await message.reply(text);

    return true;
  },
};

export default command;
