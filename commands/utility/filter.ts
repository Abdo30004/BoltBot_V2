import { Command } from "../../interfaces/command";
import { Image } from "../../Util/image";
import { MessageMedia } from "whatsapp-web.js";

const command: Command = {
  name: "filter",
  aliases: ["mask", "فلتر"],
  category: "utility",
  execute: async (client, message, translate, args) => {
    let filters = ["invert", "greyscale", "sepia", "blur", "gaussian"];
    let filter = args[0]?.toLowerCase();
    if (!filter || !filters.includes(filter)) {
      await message.reply(translate.getReply("invalidFilter"));
      return false;
    }

    let media = message.hasMedia ? await message.downloadMedia() : null;
    if (!media) {
      await message.reply(translate.getReply("noMedia"));
      return false;
    }
    if (!media.mimetype.startsWith("image")) {
      await message.reply(translate.getReply("notImage"));
      return false;
    }

    let percent = args[1] ? parseInt(args[1]) : 50;

    let image = Buffer.from(media.data, "base64");
    let filtered = await Image.filter(image, filter, percent);
    let toBase64 = filtered.toString("base64");

    let mediaFiltered = new MessageMedia("image/png", toBase64, media.filename);
    await message.reply(mediaFiltered, null);

    return true;
  },
};

export default command;
