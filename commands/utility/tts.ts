import { Command } from "../../interfaces/command";
import { getTTS } from "../../scrappers/tts";
import { MessageMedia } from "whatsapp-web.js";

const command: Command = {
  name: "tts",
  aliases: ["say", "speak", "تكلم"],
  category: "utility",

  execute: async (client, message, translate, args) => {
    let text = args.join(" ");
    if (!text) {
      await message.reply(translate.usage);
      return false;
    }
    let base64 = await getTTS(text);
    let media = new MessageMedia("audio/mp3", base64, "tts.mp3");
    await message.reply(media, null);
    return true;
  },
};
export default command;
