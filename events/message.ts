import { Event } from "../interfaces/event";
import { Message } from "whatsapp-web.js";
import { Logger } from "../Util/logger";
import countries from "../data/countries.json";

const event: Event = {
  name: "message",
  async run(client, message: Message) {
    if (message.body.indexOf(client.config.prefix) !== 0) return;
    let args = message.body
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
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
    let countryCode = await author.getCountryCode();
    let country = countries.find((c) => c.phone.includes(Number(countryCode)));

    let language =
      country.languages.filter((ln) => client.i18n.locales.includes(ln))[0] ||
      "en";
    Logger.logCommandRun(message, author, chat);
    let commandTanslate = client.i18n.getCommand(language, command.name);

    try {
      if (!commandTanslate)
        return await message.reply("Command Still in development");
      await chat.sendSeen();
      await chat.sendStateTyping();

      await command.execute(client, message, commandTanslate, args);
      await chat.clearState();
    } catch (err) {
      console.log(err);
    }
  },
};
export default event;
