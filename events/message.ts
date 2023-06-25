import { Event } from "../interfaces/event";
import { GroupChat, Message } from "whatsapp-web.js";
import { Logger } from "../Util/logger";
import countries from "../database/json/countries.json";
import { closest } from "fastest-levenshtein";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const event: Event = {
  name: "message",
  async run(client, message: Message) {
    try {
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
      let didYouMean = closest(
        cmdName,
        client.commands
          .filter((c) => !c.devOnly)
          .map((c) => c.name)
          .concat(
            client.commands
              .filter((c) => !c.devOnly)
              .map((c) => c.aliases)
              .flat()
          )
      );

      if (!command && didYouMean) {
        let didCmd =
          client.commands.get(didYouMean) ||
          client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases?.includes(`${didYouMean}`)
          );
        let commandTanslate = client.i18n.getCommand("en", didCmd.name);

        await message.reply(
          client.i18n.getDefault("en", "didYouMean", [
            {
              key: "command",
              value: `\`\`\`${commandTanslate.usage}\`\`\`${
                didYouMean === didCmd.name
                  ? ""
                  : `*(${client.config.prefix + didYouMean})*`
              }`,
            },
          ])
        );
        return;
      }

      if (!command) return;

      let chat =
        client.cache.chats.get(message.from) || (await message.getChat());
      let author =
        client.cache.users.get(message.author || message.from) ||
        (await message.getContact());
      if (client.cache.blocks.includes(author.id._serialized)) return;
      if (
        command.devOnly &&
        !client.config.devs.includes(author.id._serialized)
      )
        return;
      await chat.sendStateTyping().catch((err) => null);
      await sleep(3*1000);
      let countryCode = await author.getCountryCode();
      if (
        chat.isGroup &&
        ![client.config.test, client.config.support].includes(
          chat.id._serialized
        )
      ) {
        let groupChat = chat as GroupChat;
        await groupChat.leave();
        return;
      }
      let country = countries.find((c) =>
        c.phone.includes(Number(countryCode))
      );

      let language =
        (await client.db.schemas.User.findById(author.id._serialized))?.settings
          ?.language ||
        country.languages.filter((ln) => client.i18n.locales.includes(ln))[0] ||
        "en";
      const cooldownTime = 30;
      if (
        client.cooldowns.has(author.id._serialized) &&
        !client.config.devs.includes(author.id._serialized)
      ) {
        let cooldownInfo = client.cooldowns.get(author.id._serialized);
        if (Date.now() - cooldownInfo.time < cooldownTime * 1000) {
          if (!cooldownInfo.sent) {
            await message.reply(
              client.i18n.getDefault(language, "cooldown", [
                {
                  key: "time",
                  value: (
                    cooldownTime -
                    (Date.now() - cooldownInfo.time) / 1000
                  ).toFixed(2),
                },
              ])
            );
          }

          cooldownInfo.sent = true;
          cooldownInfo.count++;
          if (cooldownInfo.count % 5 == 0) {
            cooldownInfo.time = Date.now();
            await message.react("⛔");
          }
          return;
        }
      }
      if (!client.cache.users.has(author.id._serialized)) {
        client.cache.users.set(author.id._serialized, author);
      }
      if (!client.cache.chats.has(chat.id._serialized)) {
        client.cache.chats.set(chat.id._serialized, chat);
      }

      Logger.logCommandRun(message, author, chat);
      let commandTanslate = client.i18n.getCommand(language, command.name);

      try {
        await message.react("⏳");
        if (!commandTanslate && !command.devOnly)
          return await message.reply(
            client.i18n.getDefault(language, "noLocaleFound")
          );
        await chat.sendSeen();

        let status = await command.execute(
          client,
          message,
          commandTanslate,
          args
        );

        await chat.clearState();
        await message.react(status === false ? "❌" : "⚡");

        client.cooldowns.set(author.id._serialized, {
          time: Date.now(),
          sent: false,
          count: 0,
        });
      } catch (err) {
        console.log(err);

        await message.reply(client.i18n.getDefault(language, "error")).catch();
        await chat.clearState().catch();
        await message.react("❌").catch();
      }
    } catch (err) {
      console.log(err);
    }
  },
};
export default event;
