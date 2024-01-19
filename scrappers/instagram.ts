import { load } from "cheerio";

import axios from "axios";
let getParams = async (url: string) => {
  let form = new URLSearchParams();
  form.append("url", url);

  let { data } = await axios.post(
    "https://snapsave.app/action.php?lang=id",
    form,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; Redmi Note 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36",
      },
    }
  );
  let keys = data
    .split("decodeURIComponent(escape(r))}")[1]
    .replace(/(\(|\)|\"|)/g, "")
    .split(",");
  return keys;
};

function decode2(h: any, u: any, n: any, t: any, e: any, r: any) {
  function decode1(d: any, e: any, f: any) {
    var g =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
        ""
      );
    var h = g.slice(0, e);
    var i = g.slice(0, f);
    var j = d
      .split("")
      .reverse()
      .reduce(function (a: any, b: any, c: any) {
        if (h.indexOf(b) !== -1) return (a += h.indexOf(b) * Math.pow(e, c));
      }, 0);
    var k = "";
    while (j > 0) {
      k = i[j % f] + k;
      j = (j - (j % f)) / f;
    }
    return k || "0";
  }
  r = "";
  for (var i = 0, len = h.length; i < len; i++) {
    var s = "";
    while (h[i] !== n[e]) {
      s += h[i];
      i++;
    }
    for (var j = 0; j < n.length; j++)
      s = s.replace(new RegExp(n[j], "g"), `${j}`);
    r += String.fromCharCode(+decode1(s, e, 10) - t);
  }
  return decodeURIComponent(escape(r));
}

export const getInstagram = async (url: string) => {
  let arr = await getParams(url);
  let decoded = decode2(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);

  let html = decoded
    ?.split('getElementById("download-section").innerHTML = "')?.[1]
    ?.split('"; document.getElementById("inputData").remove(); ')?.[0]
    ?.replace(/\\(\\)?/g, "");
  if (!html) return [];

  let $ = load(html);

  let links = $("div[class=download-items]")
    .map((i, el) => {
      let type = $(el)
        .find("a")
        .text()
        .trim()
        .split(" ")[1]
        .toLocaleLowerCase();
      return {
        type,
        link:
          type === "video"
            ? $(el).find("a").attr("href")
            : $(el).find("img").attr("src"),
      };
    })
    .toArray();
  return links;
};
