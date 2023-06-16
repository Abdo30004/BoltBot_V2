import { Command } from "../../interfaces/command";

const command: Command = {
  name: "blocklist",
  aliases: ["blockList", "قائمة-الحظر"],
    devOnly: true,
    category: "devs",
  execute: async (client, message, _translate, args) => {
    let blockList = await client.getBlockedContacts();
    if (!blockList.length) {
      await message.reply("No one is blocked");
      return false;
    }

    await message.reply(
      `All Blocked ${blockList.length} users\n\n${blockList
        .map((blocked, i) => `${i+1}-${blocked.id.user}`)
        .join("\n")}}
        `
    );
    return true;
  },
};

export default command;
