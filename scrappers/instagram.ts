import axios from "axios";
import { load } from "cheerio";

export const getInstagram = async (url: string) => {
  let { data, headers } = await axios.get("https://instaphotodownloader.com/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
  });
  let $ = load(data);
  let cookie = headers["set-cookie"][0].split(";")[0];
  let form = new URLSearchParams();
  form.append("url", url);
  form.append("csrf_token", $("input[name=csrf_token]").val().toString());
  let { data: instadata } = await axios
    .post("https://instaphotodownloader.com/res", form, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://instaphotodownloader.com/",
        origin: "https://instaphotodownloader.com",
      },
    })
    .catch((err) => err.response);
  let $$ = load(instadata);
  let links = $$("a[id=download-btn]")
    .map((i, el) => {
      return {
        link: $$(el).attr("href"),
        type: $$(el).attr("data-mediatype")?.toLowerCase(),
      };
    })
    .toArray();
  return links;
};
