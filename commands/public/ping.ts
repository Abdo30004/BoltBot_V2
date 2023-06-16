import { Command } from "../../interfaces/command";

const command: Command = {
  name: "ping",
  aliases: ["إستجابة"],
  execute: async (client, message, translate, args) => {
    await message.reply(translate.getReply("pong"));
    return true;
  },
};

export default command;
