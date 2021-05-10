const tesseract = require("node-tesseract-ocr");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 4000;

const upload = require("./libs/storage");
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false, limit: "20mb" }));

app.use("/public", express.static(`${__dirname}/storage/imgs`));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const config = {
  /*
  oem: 3,
  psm: 10,
  c: "tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ-1234567890",
  */
  psm: 8,
  c: "tessedit_char_whitelist='0123456789=+??'",
};

app.post("/api/placa/registrar", upload.single("image"), (req, res) => {
  tesseract
    .recognize(path.join(__dirname, "storage/imgs", req.file.filename), config)
    .then((text) => {
      console.log(text);
      const plateNumber = String(text)
        .replace(/[^a-zA-Z ]/g, "")
        .trim();
      console.log("Numero de placa =>", plateNumber);
      res.json({ plateNumber });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.listen(port, () => {
  console.log(`Api rest corriendo en http://localhost:${port}`);
});
