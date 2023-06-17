import jimp from "jimp";
type filters = "invert" | "greyscale" | "sepia" | "blur" | "gaussian";
class Image {
  static async filter(image: Buffer, filter: filters, effectPercent?: number) {
    let imageJimp = (await jimp.read(image)).quality(100);
    switch (filter) {
      case "invert":
        imageJimp.invert();
        break;
      case "greyscale":
        imageJimp.greyscale();
        break;
      case "sepia":
        imageJimp.sepia();
        break;
      case "blur":
        imageJimp.blur(effectPercent);
        break;
      case "gaussian":
        imageJimp.gaussian(effectPercent);
        break;
    }
    return imageJimp.getBufferAsync(jimp.MIME_PNG);
  }
}

export default Image;
export { Image };
