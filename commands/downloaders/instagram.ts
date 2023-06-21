import { getInstagram } from "../../scrappers/instagram";

import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import download from "download";

const command: Command = {
  name: "instagram",
  aliases: ["insta"],
  category: "downloaders",
  execute: async (client, message, translate, args) => {
    let url = args[0];
    if (!url) {
      await message.reply(translate.usage);
      return false;
    }
    let instaPosts = await getInstagram(url);
    if (!instaPosts.length) {
      await message.reply(translate.getReply("invalidUrl"));
      return false;
    }

    const isFulfilled = <T>(
      input: PromiseSettledResult<T>
    ): input is PromiseFulfilledResult<T> => input.status === "fulfilled";
    let posts = (
      await Promise.allSettled(instaPosts.map((post) => download(post.link)))
    )
      .filter(isFulfilled)
      .map((req) => req.value.toString("base64"));
    let medias = posts.map((post, i) => {
      return new MessageMedia(
        instaPosts[i].type === "video" ? "video/mp4" : "image/jpeg",
        post,
        "post.jpeg"
      );
    });
    for (let media of medias) {
      await message.reply(media, null);
    }
    return true;
  },
};
export default command;
