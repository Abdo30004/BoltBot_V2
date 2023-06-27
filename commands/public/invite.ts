import { Command } from "../../interfaces/command";

const command: Command = {
  name: "invite",
  aliases: ["دعوة", "join"],
  category: "public",
  execute: async (client, message, commandTanslate, args) => {
    const linkRegex =
      /^(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})$/;
    const codeRegex = /(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?/;
    let link = args[0];
    if (!link) {
      await message.reply(commandTanslate.usage);
      return false;
    }
    if (!linkRegex.test(link)) {
      await message.reply(commandTanslate.getReply("noValidLink"));
      return false;
    }
    let code = link.replace(codeRegex, "");

    await client.acceptInvite(code);
    await message.reply(commandTanslate.getReply("acceptedInvite"));
    return true;
  },
};
export default command;
