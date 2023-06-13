import { getTiktok } from "../../scrappers/tiktok";

import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import download from "download";

const command: Command = {
  name: "tiktok",
  aliases: ["tk"],
  execute: async (client, message, translate, args) => {
    let url = args[0];
    let type = args[1];
    if (!url) {
      await message.reply(translate.usage);
      return;
    }
    let tiktok = await getTiktok(url);
    if (!tiktok) {
      await message.reply(translate.getReply("invalidUrl"));
      return;
    }

    if (tiktok.type == "video") {
      let video = (
        await download(type === "mp3" ? tiktok.audio : tiktok.video)
      ).toString("base64");
      let media = new MessageMedia("video/mp4", video, "video.mp4");

      await message.reply(media, null);
      return;
    }

    if (tiktok.type == "audio") {
      let audio = (await download(tiktok.audio)).toString("base64");
      let media = new MessageMedia("audio/mp3", audio, "audio.mp3");
      await message.reply(media, null, { sendAudioAsVoice: true });
      return;
    }
    const isFulfilled = <T>(
      input: PromiseSettledResult<T>
    ): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

    if (tiktok.type == "photos") {
      if (type === "mp3") {
        let audio = (await download(tiktok.audio)).toString("base64");
        let media = new MessageMedia("audio/mp3", audio, "audio.mp3");
        await message.reply(media, null);
        return;
      }
      let photos = (
        await Promise.allSettled(tiktok.photos.map((photo) => download(photo)))
      )
        .filter(isFulfilled)
        .map((photo) => photo.value.toString("base64"));
      let medias = photos.map((photo) => {
        return new MessageMedia("image/jpeg", photo, "photo.jpeg");
      });

      for (let media of medias) {
        await message.reply(media, null);
      }
    }
  },
};
export default command;
