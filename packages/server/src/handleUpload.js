import { getIcons, isValidPaletteSize } from "favgen";
import JSZip from "jszip";

// eslint-disable-next-line consistent-return
export default async (request, response, next) => {
  const { file } = request;
  if (!file) {
    return next({
      status: 400,
      message: "File is not provided.",
    });
  }

  const colorsPaletteSize = parseInt(request.body.colorsPaletteSize, 10);
  const include16 = request.body.include16 === "true";
  const { prefix } = request.body;

  const icons = getIcons({
    input: file.buffer,
    colorsPaletteSize: isValidPaletteSize(colorsPaletteSize)
      ? colorsPaletteSize
      : 64,
    include16,
    prefix,
  });

  const zip = JSZip();
  icons.forEach((icon) => zip.file(`${icon.name}`, icon.buffer));

  response.set("Content-Type", "application/zip");
  zip
    .generateNodeStream()
    .pipe(response)
    .on("finish", () => {
      response.end();
    });
};
