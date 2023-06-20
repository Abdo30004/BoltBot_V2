import { Command } from "../../interfaces/command";
import axios from "axios";
const command: Command = {
  name: "extract",
  aliases: ["textextract"],
  category: "utility",
  execute: async (client, message, translate, args) => {
    let media = message.hasMedia ? await message.downloadMedia() : null;
    let lang = args[0]?.toLowerCase();
    if (!media) {
      await message.reply(translate.getReply("noMedia"));
      return false;
    }
    if (!media.mimetype.startsWith("image")) {
      await message.reply(translate.getReply("notImage"));
      return false;
    }

    let form = new URLSearchParams();
    form.append("apikey", "K81276796888957");
    if (lang) {
      form.append("language", lang);
    }

    form.append("isOverlayRequired", "true");
    form.append("base64Image", media.data);

    let { data } = await axios
      .post("https://api.ocr.space/parse/image", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .catch((err) => {
        return { data: null };
      });

    if (!data) {
      await message.reply(translate.getReply("noData"));
      return false;
    }
    if (data.IsErroredOnProcessing) {
      await message.reply(translate.getReply("errorProcessing"));
      return false;
    }
    if (data.ParsedResults.length === 0) {
      await message.reply(translate.getReply("noText"));
      return false;
    }
    let text = data.ParsedResults.map((x: any) => x.TextOverlay)
      .map((x: any) => x.Lines)
      .map((x: any) => x.map((x: any) => x.LineText))
      .flat()
      .join("\n");
    await message.reply(
      translate.getReply("extracted", [
        {
          key: "text",
          value: text,
        },
      ]),
      null
    );
  },
};

export default command;