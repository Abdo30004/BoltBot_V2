import { getTiktok } from "../../scrappers/tiktok";

import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import download from "download";
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
    if (!tiktok.link) {
      return;
    }
    const buffer = (await download(tiktok.link, {})).toString("base64");
    const media = new MessageMedia("video/mp4", buffer, "video.mp4");

    /*
    const { data } = await axios.get(tiktok.link, {
      responseType: "arraybuffer",
    });
    let buffer = Buffer.from(data, "binary").toString("base64");

    const media = new MessageMedia("video/mp4", data, "video.mp4");
*/
    await message.reply(media, null);
  },
};

export default command;
