import axios from "axios";
import { load } from "cheerio";

export const getInstagram = async (url: string) => {
  let { data, headers } = await axios.get("https://instaphotodownloader.com/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0",
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69",
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
