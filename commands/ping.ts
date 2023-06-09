import { Command } from "../interfaces/command";

const command: Command = {
  name: "ping",
  execute: async (client, message, args) => {
    await message.reply("Pong.");
  },
};

export default command;
