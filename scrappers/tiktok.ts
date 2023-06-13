import axios from "axios";
import { load } from "cheerio";

export const getTiktok = async (url: string) => {
  let headers: any = {
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0",
  };
  let {
    data: { shortlink: newurl },
  } = await axios.get(
    `https://tokurlshortener.com/api/shorten?url=${encodeURI(url)}`,
    {}
  );
  url = newurl;

  let { data, headers: resHeaders } = await axios.post(
    "https://musicaldown.com/",
    {
      headers,
    }
  );

  let $ = load(data);
  let inputs = $.root().find("input");

  let response = {
    data: {
      [inputs.eq(0).attr("name")]: url,
      [inputs.eq(1).attr("name")]: inputs.eq(1).attr("value"),
      [inputs.eq(2).attr("name")]: inputs.eq(2).attr("value"),
    },
    cookies: resHeaders["set-cookie"][0].split(";"),
  };
  let form = new URLSearchParams();
  form.append(inputs.eq(0).attr("name"), url);
  form.append(inputs.eq(1).attr("name"), inputs.eq(1).attr("value"));
  form.append(inputs.eq(2).attr("name"), inputs.eq(2).attr("value"));

  headers = {
    ...headers,
    cookie: response.cookies[0],
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    path: "/download",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "96",
    Origin: "https://musicaldown.com",
    Referer: "https://musicaldown.com/en/",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    Te: "trailers",
  };

  let { data: tiktokData, request } = await axios.post(
    "https://musicaldown.com/download",
    form.toString(),
    {
      headers,
    }
  );
  let $tiktok = load(tiktokData);
  let type = request.res.responseUrl.includes("photo")
    ? "photos"
    : request.res.responseUrl.includes("mp3")
    ? "audio"
    : request.res.responseUrl.includes("download")
    ? "video"
    : "error";

  if (type === "error") return null;
  if (type === "video") {
    let { data: audioData } = await axios.post(
      "https://musicaldown.com/mp3/download/",
      form.toString(),
      {
        headers,
      }
    );
    let $audio = load(audioData);
    return {
      type,
      video: $tiktok("div[class=row]")
        .eq(1)
        .find(`a[class="btn waves-effect waves-light orange"]`)
        .attr("href"),
      audio: $audio("source").attr("src"),
    };
  }
  if (type === "audio") {
    return {
      type,
      audio: $tiktok("source").attr("src"),
    };
  }
  if (type === "photos") {
    let photos: string[] = $tiktok("div[class=card-image]")
      .find("img")
      .map((i, el) => {
        return $tiktok(el).attr("src");
      })
      .toArray();
    return {
      type,
      photos,
      audio: $tiktok(
        `a[class="btn waves-effect waves-light orange download"]`
      ).attr("href"),
    };
  }
};
