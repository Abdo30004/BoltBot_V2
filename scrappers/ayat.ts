import axios from "axios";
import fs from "fs";
const getAyats = async (id: number) => {
  const { data: response } = await axios.get(
    `https://quran-endpoint.vercel.app/quran/${id}`
  );
  return response.data.ayahs.map((ayah: any) => ayah.audio.url);
};

