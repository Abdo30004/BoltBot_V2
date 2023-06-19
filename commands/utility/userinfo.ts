import { Command } from "../../interfaces/command";
import countries from "../../database/json/countries.json";
import { MessageMedia } from "whatsapp-web.js";
const command: Command = {
  name: "userinfo",
  aliases: ["info"],
  category: "utility",
  execute: async (client, message, commandTanslate) => {
    let user =
      (await message.getMentions())?.[0] || (await message.getContact());

    let code = await user.getCountryCode();
    let country = countries.find((c) => c.phone.includes(Number(code)));
    let about = await user.getAbout();
    let formattedNumber = await user.getFormattedNumber();
    let profilePicUrl = await user.getProfilePicUrl();

    let pic = profilePicUrl
      ? await MessageMedia.fromUrl(profilePicUrl, {
          unsafeMime: true,
        })
      : undefined;
    let reply = commandTanslate.getReply("userInfo", [
      {
        key: "user",
        value: user.id.user,
      },
      {
        key: "userName",
        value: user.name || user.id.user,
      },
      {
        key: "countryName",
        value: country?.name || "Unknown",
      },
      {
        key: "nativeName",
        value: country?.native || "Unknown",
      },
      {
        key: "flag",
        value: country.emoji || "🏳️",
      },
      {
        key: "languages",
        value: country?.languages.join(", ") || "Unknown",
      },
      {
        key: "phone",
        value: formattedNumber || "Unknown",
      },
      {
        key: "about",
        value: about || "None",
      },
    ]);
    await message.reply(reply, message.from, {
      media: pic,
    });
    return true;
  },
};
