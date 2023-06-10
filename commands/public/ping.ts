import { Command } from "../../interfaces/command";

const command: Command = {
  name: "ping",
  aliases: ["إستجابة"],
  execute: async (client, message, translate, args) => {
    let ping = Date.now() - message.timestamp*1000;

    await message.reply(
      `${translate.getReply("pong", [{ key: "ping", value: ping }])}`
    );
  },
};

export default command;
