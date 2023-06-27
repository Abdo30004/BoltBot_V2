import { Command } from "../../interfaces/command";
import { GroupChat } from "whatsapp-web.js";
const command: Command = {
  name: "unlock",
  aliases: ["فتح", "تكلم"],
  category: "groups",
  adminOnly: true,
  groupOnly: true,
  adminPermision: true,

  execute: async (client, message, commandTanslate) => {
    let chat = (await message.getChat()) as GroupChat;
    chat.setMessagesAdminsOnly(false);
    await message.reply(commandTanslate.getReply("unlocked"));
    return true;
  },
};

export default command;
