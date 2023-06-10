import { Command } from "../../interfaces/command";

const command: Command = {
  name: "ping",
  aliases: ["إستجابة"],
  execute: async (client, message, translate, args) => {
    let ping = Date.now() - message.timestamp;

    await message.reply(
      `${translate.getReply("ping", [{ key: "ping", value: ping }])}}`
    );
  },
};

export default command;
