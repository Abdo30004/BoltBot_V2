import { getTiktok } from "../../scrappers/tiktok";

import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
const command: Command = {
  name: "tiktok",
  aliases: ["tk"],
  execute: async (client, message, translate, args) => {
    let url = args[0];
    if (!url) {
      await message.reply(translate.getReply("noUrl"));
      return;
    }
    let tiktok = await getTiktok(url);
    if (!tiktok) {
      await message.reply(translate.getReply("invalidUrl"));
      return;
    }
    let media = await MessageMedia.fromUrl(tiktok.link, {
      filename: "tiktok.mp4",
        unsafeMime: true,
       
    });
    await message.reply(media);
  },
};

export default command;
