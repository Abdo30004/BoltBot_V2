import { Command } from "../../interfaces/command";
import { GroupChat } from "whatsapp-web.js";
const command: Command = {
  name: "kick",
  aliases: ["remove"],
  category: "groups",
  adminOnly: true,
  groupOnly: true,
  adminPermision: true,
  execute: async (client, message, commandTanslate, args) => {
    let chat = (await message.getChat()) as GroupChat;
    if (chat.id._serialized === client.config.support) return false;

    let author = await message.getContact();

    let isOwner = chat.owner._serialized === author.id._serialized;

    let mentions = (await message.getMentions())?.filter(
      (m) => ![client.info.wid.user, chat.owner._serialized].includes(m.id.user)
    );

    if (args[0] === "all") {
      if (!isOwner) {
        await message.reply(commandTanslate.getReply("notOwner"));
        return false;
      }
      await message.reply(commandTanslate.getReply("confirmKickAll"));

      let confirm = await client
        .awaitMessage({
          time: 3 * 60 * 1000,
          filter: (m) => m.author === chat.owner._serialized,
        })
        .catch(() => null);
      if (confirm?.body?.toLowerCase() !== "yes") {
        await message.reply(commandTanslate.getReply("kickAllCanceled"));
        return false;
      }

      await chat.removeParticipants(
        chat.participants
          .filter((p) => p.id.user !== client.info.wid.user)
          .map((p) => p.id._serialized)
      );
      await message.reply(commandTanslate.getReply("kickAll"));
      return true;
    }
    if (mentions.length === 0) {
      await message.reply(commandTanslate.usage);
      return false;
    }

    if (mentions.length > 5 && !isOwner) {
      await message.reply(commandTanslate.getReply("kickLimit"));
      return false;
    }
    await chat.removeParticipants(mentions.map((m) => m.id._serialized));
    await message.reply(
      commandTanslate.getReply("kickedUsers", [
        {
          key: "count",
          value: mentions.length.toString(),
        },

        {
          key: "users",
          value: mentions.map((m) => `-${m.id.user}`).join("\n"),
        },
      ]),
      null,
      { mentions: mentions }
    );

    return true;
  },
};

export default command;
