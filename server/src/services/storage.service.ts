import S3 from "aws-sdk/clients/s3";
import { ENV } from "../config";

export enum SIGNED_ACCESS {
  GET = "getObject",
  PUT = "putObject",
}

export class ObjectStorage {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      endpoint: `https://${ENV.R2_ACC_ID}.r2.cloudflarestorage.com`,
      accessKeyId: ENV.R2_ACCESS_KEY,
      secretAccessKey: ENV.R2_SECRET,
      signatureVersion: "v4",
    });
  }

  /**
   * Generate a signed URL for an object in R2
   * @param key Object key (filename)
   * @param access GET or PUT
   * @param expiresIn Expiry in seconds (default: 3600)
   */
  async getSignedUrl(
    key: string,
    access: SIGNED_ACCESS,
    expiresIn = 3600
  ): Promise<string> {
    return this.s3.getSignedUrlPromise(access, {
      Bucket: ENV.R2_BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    });
  }
}
