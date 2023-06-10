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
        return;
      }
      await message.reply(
        translate.getReply("commandInfo", [
          {
            key: "command",
            value: command.name,
          },
          {
            key: "usage",
            value: `${client.config.prefix}${command.name} ${translate.usage}`,
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
    }
  },
};

export default command;
