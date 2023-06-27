import { Command } from "../../interfaces/command";
import { GroupChat } from "whatsapp-web.js";
const command: Command = {
  name: "lock",
  aliases: ["غلق", "قفل"],
  category: "groups",
  adminOnly: true,
  groupOnly: true,
  adminPermision: true,

  execute: async (client, message, commandTanslate) => {
    let chat = (await message.getChat()) as GroupChat;

    chat.setMessagesAdminsOnly(true);
    await message.reply(commandTanslate.getReply("locked"));
    return true;
  },
};

export default command;
