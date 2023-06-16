import { Command } from "../../interfaces/command";

const command: Command = {
  name: "block",
  aliases: ["block", "حظر"],
  devOnly: true,
  execute: async (client, message, _translate, args) => {
    let blockedList = (await message.getMentions()).filter(
      (blocked) => !client.config.devs.includes(blocked.id._serialized)
    );
    if (!blockedList.length) {
      await message.reply("No one to block");
      return false;
    }
    for (let blocked of blockedList) {
      await blocked.block();
    }

    await message.reply(
      `Blocked ${blockedList.length} users\n\n${blockedList
        .map((blocked, i) => i + blocked.id.user)
        .join("\n")}}`
    );
    return true;
  },
};

export default command;
