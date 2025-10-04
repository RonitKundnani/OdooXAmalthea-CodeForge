const Tesseract = require("tesseract.js");
const sharp = require("sharp");
Tesseract.recognize(
  "image.jpg",        // Path to your scanned image or document
  "eng",                 // Language (English here)
  {
    logger: info => console.log(info) // Logs progress
  }
).then(({ data: { text } }) => {
  console.log("Extracted Text:", text);
});
sharp("image.jpg")
  .grayscale()
  .toFile("processed.png")
  .then(() => {
    console.log("Image preprocessed!");
  });
