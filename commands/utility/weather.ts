import { Command } from "../../interfaces/command";
import { MessageMedia } from "whatsapp-web.js";
import axios from "axios";
import moment from "moment-timezone";
import countries from "../../database/json/countries.json";
function to_km_per_h(speed: number) {
  const turned = speed * 3.6;
  return Math.round((turned + Number.EPSILON) * 100) / 100;
}
function timeInfo(data: any) {
  return {
    Sunrise: moment(new Date(data.sys.sunrise * 1000)).utcOffset(
      data.timezone / 3600
    ),
    Sunset: moment(new Date(data.sys.sunset * 1000)).utcOffset(
      data.timezone / 3600
    ),
    now: moment(Date.now()).utcOffset(data.timezone / 3600),
    Timezone: `${moment()
      .utcOffset(data.timezone / 3600)

      .format("UTC(G[M]T)Z")}`,
  };
}
const command: Command = {
  name: "weather",
  aliases: ["طقس", "wt"],
  category: "utility",
  execute: async (client, message, translate, args) => {
    let city = encodeURI(args.join(" "));
    if (!city) {
      let phone = await (await message.getContact()).getCountryCode();
      city = countries.find((c) => c.phone.includes(parseInt(phone))).capital;
    }

    let { data } = await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1dc1e6c1abe02c76f6741679a8879119&units=metric&lang=${
          translate.locale || "en"
        }}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      )
      .catch((err) => {
        return {
          data: null,
        };
      });
    if (!data) {
      await message.reply(translate.getReply("noData"));
      return false;
    }

    const icon = data.weather[0].icon;

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
    let time = timeInfo(data);
    let country = countries.find((c) => c.code === data.sys.country);
    let reply = translate.getReply("weatherInfo", [
      {
        key: "country",
        value: `${country.name} (${country.native})`,
      },
      {
        key: "city",
        value: data.name,
      },
      {
        key: "temperature",
        value: data.main.temp,
      },
      {
        key: "status",
        value: data.weather[0].description,
      },
      {
        key: "wind",
        value: to_km_per_h(data.wind.speed),
      },
      {
        key: "humidity",
        value: data.main.humidity,
      },
      {
        key: "pressure",
        value: data.main.pressure,
      },
      {
        key: "sunrise",
        value: `${time.Sunrise.format("LT")} (${time.Sunrise.fromNow()})`,
      },
      {
        key: "sunset",
        value: `${time.Sunset.format("LT")} (${time.Sunset.fromNow()})`,
      },
      {
        key: "timezone",
        value: time.Timezone,
      },
      {
        key: "geo",
        value: `${data.coord.lat}, ${data.coord.lon}`,
      },

      {
        key: "date",
        value: time.now.format("LLLL"),
      },
    ]);
    await message.reply(reply, null, { media });
    return true;
  },
};

export default command;
