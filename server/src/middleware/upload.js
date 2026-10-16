import multer from 'multer';
import os from 'os';
import path from 'path';

export const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const parser = multer({
  dest: path.join(os.tmpdir(), 'study-ai'),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) =>
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(Object.assign(new Error('Unsupported file type. Upload a JPG, PNG, WebP or PDF.'), { status: 415 })),
}).single('file');

export const upload = (req, res, next) =>
  parser(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') err = Object.assign(new Error('File is larger than the 20 MB limit.'), { status: 413 });
    else if (err.name === 'MulterError') err.status = 400;
    next(err);
  });
