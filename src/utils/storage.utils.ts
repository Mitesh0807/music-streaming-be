import multer from "multer";
import multers3 from "multer-s3";
import aws from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const SECRETACCESSKEY = process.env.SECRET_ACCESS_KEY as string;
const ACCESSKEYID = process.env.ACCESS_KEY as string;
const REGION = process.env.REGION as string;
const BUCKET_NAME = process.env.BUCKET_NAME as string;
const s3 = new S3Client({
  credentials: {
    secretAccessKey: SECRETACCESSKEY,
    accessKeyId: ACCESSKEYID,
  },
  region: REGION,
});
const upload = multer({
  storage: multers3({
    s3: s3,
    bucket: BUCKET_NAME,
    contentType: multers3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

export default upload;
