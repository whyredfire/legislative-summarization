import { S3Client } from "bun";
import { S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT } from "./vars";

export const s3Client = new S3Client({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  bucket: "legalease",
  endpoint: S3_ENDPOINT,
});

async function uploadFile2S3(source, destination) {
  const localFile = Bun.file(source);

  // check if the file exists
  if (!localFile.exists()) {
    console.error(`Local file not found ${file_path}`);
    return;
  }

  try {
    // (destination, source)
    await Bun.write(destination, localFile);
    console.log(`Uploaded ${localFile.name} to ${s3.config.bucket}`);
  } catch (error) {
    console.error(error);
  }
}
