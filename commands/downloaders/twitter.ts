import { getTwitter } from "../../scrappers/twitter";

import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import download from "download";
import { extension } from "mime-types";

const command: Command = {
  name: "twitter",
  aliases: ["tw"],
  category: "downloaders",
  execute: async (client, message, translate, args) => {
    let url = args[0];
    if (!url) {
      await message.reply(translate.usage);
      return false;
    }
    let twitterMedias = await getTwitter(url);
    if (!twitterMedias) {
      await message.reply(translate.getReply("invalidUrl"));
      return false;
    }
    for (let info of twitterMedias) {
      let buffer = (await download(info.link)).toString("base64");
      let media = new MessageMedia(
        info.mime,
        buffer,
        `media.${extension(info.mime)}`
      );
      await message.reply(media, null);
    }
    return true;
  },
};

export default command;
