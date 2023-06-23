import axios from "axios";

const _twitterapi = (id: string) =>
  `https://api.twitter.com/1.1/statuses/show/${id}.json?tweet_mode=extended`;
/*
const getAuthorization = async () => {
  const { data } = await axios.get("https://pastebin.com/raw/nz3ApKQM");
  return data;
};*/

const getGuestToken = async () => {
  try {
    const { data } = await axios(
      "https://api.twitter.com/1.1/guest/activate.json",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        },
      }
    );
    return data.guest_token;
  } catch {
    return null;
  }
};

export const getTwitter = async (
  url: string
): Promise<{ type: string; link: string; mime: string }[]> => {
  const id = url.match(/\/([\d]+)/);
  if (!id) return null;
  let { data } = await axios.get(_twitterapi(id[1]), {
    headers: {
      Authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
      "x-guest-token": await getGuestToken(),
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
    },
  });
  if (!data.extended_entities) return null;

  let medias = data.extended_entities.media.map((media: any) => {
    let type = media.type;
    if (media.video_info) {
      let variants = media.video_info.variants
        .sort((a: any, b: any) => b.bitrate - a.bitrate)
        .filter((a: any) => a.content_type.includes("video"));
      return {
        type,
        link: variants[0].url,
        mime: variants[0].content_type,
      };
    }
    return {
      type,
      link: media.media_url_https || media.media_url,
      mime: `image/${media.media_url.split(".").pop() || "png"}`,
    };
  });

  return medias;
};


