import { Command } from "../interfaces/command";

const command: Command = {
  name: "ping",
  execute: async (client, message, translate, args) => {
    await message.reply(translate.getReply("pong"));
  },
};

export default command;
