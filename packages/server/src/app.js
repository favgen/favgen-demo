import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/error.js";
import uploadMiddleware from "./middlewares/upload.js";
import { DOMAIN_NAME, ENV, PORT } from "./utils/config.js";
import handleUpload from "./handleUpload.js";

function getInitializedApp() {
  const app = express();
  app.set("trust proxy", 1);

  if (ENV === "production") {
    app.use(cors({ origin: `*.${DOMAIN_NAME}` }));
  }
  app.use(bodyParser.json());

  app.post("/upload", uploadMiddleware("file"), handleUpload);

  app.use(errorMiddleware);

  return app;
}

getInitializedApp().listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`App listening on the port ${PORT}`),
);
