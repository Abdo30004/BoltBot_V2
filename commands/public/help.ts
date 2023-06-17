import { Command } from "../../interfaces/command";

declare global {
  interface String {
    title(): string;
  }
}
String.prototype.title = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const command: Command = {
  name: "help",
  aliases: ["commands", "أوامر", "اوامر", "مساعدة"],
  category: "public",
  execute: async (client, message, translate, args) => {
    if (args[0]) {
      let command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (cmd) =>
            cmd.aliases && cmd.aliases?.includes(`${args[0].toLowerCase()}`)
        );
      if (!command || command.devOnly) {
        await message.reply(
          translate.getReply("commandNotFound", [
            { key: "command", value: args[0].toLowerCase() },
          ])
        );
        return false;
      }
      await message.reply(
        translate.getReply("commandInfo", [
          {
            key: "command",
            value: command.name,
          },
          {
            key: "usage",
            value: `\`${translate.usage}\``,
          },
          {
            key: "description",
            value: translate.description,
          },
          {
            key: "aliases",
            value: command.aliases?.join(", ") || "None",
          },
        ])
      );
      return true;
    }
    let categories = ["public", "downloaders", "utility"];
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
          value: client.config.support,
        },
      ])
    );
    return true;
  },
};

export default command;
