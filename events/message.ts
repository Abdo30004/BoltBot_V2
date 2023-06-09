import { Client } from "../base/client";
import { Event } from "../interfaces/event";
import { Message } from "whatsapp-web.js";
import { Logger } from "../Util/logger";
const event: Event = {
  name: "message_create",
  async run(client: Client, message: Message) {
    let prefix = "!";
    if (message.body.indexOf(prefix) !== 0) return;
    let args = message.body.slice(prefix.length).trim().split(/ +/g);
    let cmdName = args.shift()?.toLowerCase();
    if (!cmdName) return;
    let command =
      client.commands.get(cmdName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases?.includes(`${cmdName}`)
      );
    if (!command) return;
    let chat = await message.getChat();
    let author = await message.getContact();
    Logger.logCommandRun(message, author, chat);

    try {
      await chat.sendStateTyping();
      await command.execute(client, message, args);
    } catch (err) {
      console.log(err);
    }
  },
};
export default event;
