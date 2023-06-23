import { getYoutube } from "../../scrappers/youtube";
import { validateURL } from "ytdl-core";
import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import download from "download";
import { extension } from "mime-types";
const command: Command = {
  name: "youtube",
  aliases: ["yt"],
  category: "downloaders",
  execute: async (client, message, translate, args) => {
    let url = args[0];
    let type = args[1];
    if (!url) {
      await message.reply(translate.usage);
      return false;
    }
    if (!validateURL(url)) {
      await message.reply(translate.getReply("invalidUrl"));
      return false;
    }
    let isAudio = type === "mp3";
    let youtube = await getYoutube(url, isAudio);
    if (!youtube) {
      await message.reply(translate.getReply("error"));
      return false;
    }
    if (youtube.isShorts) {
      let buffer = (await download(youtube.link)).toString("base64");
      let media = new MessageMedia(
        youtube.mime || isAudio ? "audio/mp3" : "video/mp4",
        buffer,
        `media.${extension(youtube.mime)}`
      );
      await message.reply(media, null, {
        sendMediaAsDocument: isAudio,
      });
      return true;
    }
    await message.reply(youtube.link, null);
  },
};

export default command;
