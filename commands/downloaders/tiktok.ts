import { getTiktok } from "../../scrappers/tiktok";

import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import axios from "axios";
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
    let { data } = await axios.get(tiktok.link, {
      responseType: "arraybuffer",
    });

    let base64 = Buffer.from(data).toString("base64");
    let media = new MessageMedia("video/mp4", base64, "tiktok.mp4");

    await message.reply(media, null);
  },
};

export default command;
