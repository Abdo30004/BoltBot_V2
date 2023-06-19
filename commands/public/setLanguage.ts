import { Command } from "../../interfaces/command";

const command: Command = {
  name: "setlanguage",
  aliases: ["setLang", "تغيير-اللغة", "تغيير-لغة"],
  category: "public",
  execute: async (client, message, translate, args) => {
    let lang = args[0];
    if (!lang) {
      await message.reply(translate.usage);
      return false;
    }
    let supportedLangs = [...client.i18n.languages.keys()];
    if (supportedLangs.includes(lang)) {
      await message.reply(
        translate.getReply("invalidLanguage", [
          { key: "langs", value: supportedLangs.join(", ") },
        ])
      );
    }
    let author = await message.getContact();
    let data = await client.db.schemas.User.findById(author.id._serialized);
    if (!data) {
      data = new client.db.schemas.User({
        _id: author.id._serialized,
        settings: {
          language: lang,
        },
      });
    } else {
      data.settings.language = lang;
    }
    await data.save();
    await message.reply(
      translate.getReply("languageChanged", [
        {
          key: "lang",
          value: lang,
        },
      ])
    );

    return true;
  },
};

export default command;
