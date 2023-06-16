//command import
import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
//command export

const command: Command = {
  name: "sticker",
  aliases: ["st", "ملصق"],
  category: "utility",
  execute: async (client, message, translate, args) => {
    let media = message.hasMedia ? await message.downloadMedia() : null;
    if (!media) {
      await message.reply(translate.getReply("noMedia"));
      return false;
    }

    let sticker = new MessageMedia(media.mimetype, media.data, media.filename);
    let stickerMetadata = {
      stickerAuthor: "Generated by BoltBot⚡",

      stickerName: args.join(" ") || "sticker",
    };
    await message.reply(sticker, null, {
      sendMediaAsSticker: true,
      ...stickerMetadata,
    });
    return true;
  },
};

export default command;
