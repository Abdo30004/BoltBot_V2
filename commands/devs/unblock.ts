import { Command } from "../../interfaces/command";

const command: Command = {
  name: "unblock",
  aliases: ["unblock", "إلغاء-حظر"],
    devOnly: true,
    category: "devs",
  execute: async (client, message, _translate, args) => {
    let unblockedList = await message.getMentions();
    if (!unblockedList.length) {
      await message.reply("No one to unblock");
      return false;
    }
    for (let unblocked of unblockedList) {
      await unblocked.unblock();
    }

    await message.reply(
      `unblocked ${unblockedList.length} users\n\n${unblockedList
        .map((unblocked, i) => `${i + 1}-${unblocked.id.user}`)
        .join("\n")}}`
    );
    return true;
  },
};

export default command;
