import { Command } from "../../interfaces/command";

const command: Command = {
  name: "help",
  aliases: ["commands", "أوامر", "اوامر", "مساعدة"],

  execute: async (client, message, translate, args) => {
    if (args[0]) {
      let command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (cmd) =>
            cmd.aliases && cmd.aliases?.includes(`${args[0].toLowerCase()}`)
        );
      if (!command) {
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

    let commands = client.commands
      .map((cmd) => {
        return {
          name: cmd.name,
          aliases: cmd.aliases?.join(", ") || "None",
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((cmd) => {
        return `• ${cmd.name} - ${cmd.aliases}`;
      })
      .join("\n");

    await message.reply(
      translate.getReply("commandsList", [
        {
          key: "commands",
          value: commands,
        },
      ])
    );
    return true;
  },
};

export default command;
