import axios from "axios";
import { getInfo, validateURL } from "ytdl-core";

export const getYoutube = async (url: string, audio?: boolean) => {
  const info = await getInfo(url);
  const isShorts = +info.videoDetails.lengthSeconds < 62;
  let bestQuality = info.formats
    .filter((f) =>
      audio
        ? !f.hasVideo && f.hasAudio 
        : f.hasVideo && f.hasAudio
    )
    .reverse()[0];
  if (!bestQuality) return null;
  if (isShorts) {
    return {
      link: bestQuality.url,
      mime: bestQuality.mimeType,
      isShorts,
    };
  }
  if (!isShorts) {
    let shortLink = await axios.get(
      `https://tinyurl.com/api-create.php?url=${bestQuality.url}`
    );
    return {
      link: shortLink.data,
      isShorts,
    };
  }
};

