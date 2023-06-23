import { Command } from "../../interfaces/command";

const command: Command = {
  name: "setlanguage",
  aliases: ["setlang", "تغيير-اللغة", "تغيير-لغة"],
  category: "public",
  execute: async (client, message, translate, args) => {
    let lang = args[0]?.toLowerCase();
    let flags = {
      ar: "🇸🇦",
      en: "🇺🇸",
      fr: "🇫🇷",
      es: "🇪🇸",
      de: "🇩🇪",
      it: "🇮🇹",
      pl: "🇵🇱",
    };
    let supportedLangs = [...client.i18n.languages.keys()];
    if (!lang || !supportedLangs.includes(lang)) {
      await message.reply(
        translate.getReply("invalidLanguage", [
          {
            key: "langs",
            value: `\n${supportedLangs
              .map(
                (language) =>
                  `-${language} ${flags[language as keyof typeof flags]}`
              )
              .join("\n")}`,
          },
        ])
      );
      return false;
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

    translate = client.i18n.getCommand(lang, command.name);
    await message.reply(
      translate.getReply("languageChanged", [
        {
          key: "lang",
          value: `${lang} ${flags[lang as keyof typeof flags]}`,
        },
      ])
    );

    return true;
  },
};

export default command;
