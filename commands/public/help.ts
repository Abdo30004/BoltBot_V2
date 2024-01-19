import { Command } from "../../interfaces/command";

declare global {
  interface String {
    title(): string;
  }
}
String.prototype.title = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const Helpcommand: Command = {
  name: "help",
  aliases: ["commands", "أوامر", "اوامر", "مساعدة"],
  category: "public",
  execute: async (client, message, translate, args) => {
    if (args[0]) {
      let commandHelped =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (cmd) =>
            cmd.aliases && cmd.aliases?.includes(`${args[0].toLowerCase()}`)
        );

      if (!commandHelped || commandHelped.devOnly) {
        await message.reply(
          translate.getReply("commandNotFound", [
            { key: "command", value: args[0].toLowerCase() },
          ])
        );
        return false;
      }
      let locale = client.i18n.getCommand(translate.locale, commandHelped.name);
      await message.reply(
        translate.getReply("commandInfo", [
          {
            key: "name",
            value: commandHelped.name,
          },
          {
            key: "usage",
            value: `\`${locale.usage}\``,
          },
          {
            key: "description",
            value: locale.description,
          },
          {
            key: "aliases",
            value: commandHelped.aliases?.join(", ") || "None",
          },
        ])
      );
      return true;
    }
    let categories = [...new Set(client.commands.map((c) => c.category))];
    let author = await message.getContact();
    let isDev = client.config.devs.includes(author.id._serialized);
    if (!isDev) categories = categories.filter((c) => c !== "devs");
    let string = categories
      .map((category) => {
        let categoryCommands = client.commands
          .filter((cmd) => cmd.category === category)
          .map((c) => `\`\`\`/${c.name}\`\`\``);
        if (!categoryCommands.length) return;
        let number = Math.ceil((33 - 2 - category.length) / 2);
        let paded = "".padStart(number, "-");
        return `\n${paded} *${category.title()}* ${paded}\n${categoryCommands.join(
          "\n"
        )}`;
      })
      .map((c) => c)
      .join("\n");
    await message.reply(
      translate.getReply("commandsList", [
        {
          key: "commands",
          value: string,
        },
        {
          key: "invite",
          value: client.config.invite,
        },
      ])
    );
    return true;
  },
};

export default Helpcommand;
