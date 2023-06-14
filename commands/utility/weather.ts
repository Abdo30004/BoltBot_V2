import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import axios from "axios";
import moment from "moment-timezone";
import countries from "../../data/countries.json";
function to_km_per_h(speed: number) {
  const turned = speed * 3.6;
  return Math.round((turned + Number.EPSILON) * 100) / 100;
}

const command: Command = {
  name: "weather",
  aliases: ["طقس", "wt"],
  execute: async (client, message, translate, args) => {
    let city = encodeURI(args.join(" "));
    if (!city) {
      let phone = await (await message.getContact()).getCountryCode();
        city = countries.find((c) => c.phone.includes(parseInt(phone))).capital;
        
    }

    var { data } = await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1dc1e6c1abe02c76f6741679a8879119&units=metric&lang=${
          translate.local || "en"
        }}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      )
      .catch((err) => null);
    if (!data) {
      await message.react("❌");
      await message.reply(translate.getReply("cityNotFound"));
      return;
    }

    const string = `*Country:* ${data.sys.country}\n\n*City:* ${
      data.name
    }\n\n*Temperature:* ${data.main.temp}°C\n\n*Description:* ${
      data.weather[0].description
    }\n\n*Wind:* ${to_km_per_h(data.wind.speed)} km/h\n\n*Humidity:* ${
      data.main.humidity
    }%\n\n*Pressure:* ${data.main.pressure} hPa\n\n*Sunrise:* ${moment(
      new Date(data.sys.sunrise * 1000)
    )
      .utcOffset(data.timezone / 3600)
      .format("LT")} (${moment(new Date(data.sys.sunrise * 1000))
      .utcOffset(data.timezone / 3600)
      .fromNow()})\n\n*Sunset:* ${moment(new Date(data.sys.sunset * 1000))
      .utcOffset(data.timezone / 3600)
      .format("LT")} (${moment(new Date(data.sys.sunset * 1000))
      .utcOffset(data.timezone / 3600)
      .fromNow()})\n\n*Timezone:* ${moment()
      .utcOffset(data.timezone / 3600)
      .format("UTC(G[M]T)Z")} hours\n\n*Geo Coordinates:* ${data.coord.lat}, ${
      data.coord.lon
    }`;
    const icon = data.weather[0].icon;
    //const media = await MessageMedia.fromUrl(icon, { unsafeMime: true });
    let media;
    const iconPath = `${client.path}\\assets\\Images\\weather\\${
      data.weather[0].description
    } ${icon.endsWith("d") ? "day" : "night"}.png`;
    const defaultIconPath = `${client.path}\\assets\\Images\\not-found.png`;
    try {
      media = MessageMedia.fromFilePath(iconPath);
    } catch (error) {
      media = MessageMedia.fromFilePath(defaultIconPath);
    }

    await message.reply(string, null, { media });
  },
};

export default command;
