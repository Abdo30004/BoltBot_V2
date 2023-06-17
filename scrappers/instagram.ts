import axios from "axios";
import { load } from "cheerio";
import { writeFile } from "fs/promises";

export const getInstagram = async (url: string) => {
  let response = await axios
    .get("https://instaphotodownloader.com/", {
      headers: {
        /*"User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",*/
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0",
      },
    })
    .catch((err) => err.response);
  let { data, headers } = response;
  let $ = load(data);
  if (response.status !== 200) {
    let form = $("form");
    let link = "https://instaphotodownloader.com/" + form.attr("action");
    let body = new URLSearchParams();
    form.find("input").each((i, el) => {
      body.append($(el).attr("name"), $(el).attr("value"));
    });
    var { data: newdata, headers: newheaders } = await axios.post(link, body, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Content-Type": "application/x-www-form-urlencoded",
        referer: "https://instaphotodownloader.com/",
        origin: "https://instaphotodownloader.com",
      },
    });
    writeFile("test.html", newdata);
  }
  data = newdata;
  headers = newheaders;

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
