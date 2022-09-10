import multer from "multer";
import { UPLOAD_MAX_SIZE_BYTES } from "../utils/config.js";

function isImage(file) {
  return file.mimetype.startsWith("image/");
}

function isFileSizeError(error) {
  return (
    error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
  );
}

function getFileTooLargeError(fileLimitBytes) {
  const fileLimitMb = Math.floor(fileLimitBytes / (1024 * 1024));
  return {
    status: 413,
    message: `File too large. Maximum allowed size is ${fileLimitMb}MB.`,
  };
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_MAX_SIZE_BYTES,
  },
  fileFilter: (req, file, cb) => {
    if (!isImage(file)) {
      return cb({
        status: 400,
        message: "File is not an image.",
      });
    }

    return cb(null, true);
  },
});

function uploadMiddleware(fileField) {
  return (request, response, next) => {
    upload.single(fileField)(request, response, (error) => {
      if (isFileSizeError(error)) {
        return next(getFileTooLargeError(UPLOAD_MAX_SIZE_BYTES));
      }

      if (error) {
        return next(error);
      }

      return next();
    });
  };
}

export default uploadMiddleware;
