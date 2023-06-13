import { Command } from "../../interfaces/command";

const command: Command = {
  name: "ping",
  aliases: ["إستجابة"],
  execute: async (client, message, translate, args) => {
    let date = Date.now();
    let ping = date - message.timestamp * 1000;
    console.log(message.timestamp);
    console.log(date);
    await message.reply(
      `${translate.getReply("pong", [
        { key: "ping", value: Math.floor(ping / 1000) },
      ])}`
    );
  },
};

export default command;
