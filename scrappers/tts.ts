import * as tts from "google-tts-api";
import { detect } from "tinyld";
export const getTTS = async (text: string) => {
  let lang = detect(text);

  const base64 = await tts.getAudioBase64(text, {
    lang: lang || undefined,
    slow: false,
    timeout: 10000,
  });
  return base64;
};
