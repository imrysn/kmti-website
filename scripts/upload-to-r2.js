
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { glob } from "glob";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("❌ Missing R2 credentials in .env file.");
  console.error("Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are set.");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const uploadFile = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const relativePath = path.relative(path.join(__dirname, "../src/assets"), filePath).replace(/\\/g, "/");
  const contentType = mime.lookup(filePath) || "application/octet-stream";

  console.log(`Uploading ${relativePath}...`);

  try {
    const upload = new Upload({
      client,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: relativePath,
        Body: fileStream,
        ContentType: contentType,
      },
    });

    await upload.done();
    console.log(`✅ Uploaded: ${relativePath}`);
  } catch (error) {
    console.error(`❌ Failed to upload ${relativePath}:`, error);
  }
};

const main = async () => {
  // Corrected glob pattern to find all files in src/assets recursively
  const assetFiles = await glob("src/assets/**/*", { nodir: true });

  console.log(`Found ${assetFiles.length} files to upload.`);

  for (const file of assetFiles) {
    await uploadFile(file);
  }

  console.log("🎉 All uploads completed!");
};

main();
