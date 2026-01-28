
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ? process.env.R2_ACCOUNT_ID.trim() : "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ? process.env.R2_ACCESS_KEY_ID.trim() : "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ? process.env.R2_SECRET_ACCESS_KEY.trim() : "";

console.log("Checking credentials format...");
console.log(`Account ID length: ${R2_ACCOUNT_ID.length}`);
console.log(`Access Key ID length: ${R2_ACCESS_KEY_ID.length}`);
console.log(`Secret Access Key length: ${R2_SECRET_ACCESS_KEY.length}`);

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("❌ Missing credentials.");
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

const run = async () => {
  try {
    console.log("Attempting to list buckets...");
    const data = await client.send(new ListBucketsCommand({}));
    console.log("✅ Success! Connected to R2.");
    console.log("Buckets:", data.Buckets?.map(b => b.Name).join(", "));
  } catch (err) {
    console.error("❌ Error connecting to R2:", err);
  }
};

run();
