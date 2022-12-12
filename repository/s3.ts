import { S3 } from "aws-sdk";

const s3 = new S3({ region: "us-east-1" });

export class S3Repository {
  public static createPresignedPost(key: string, bucket: string) {
    return s3.createPresignedPost({
      Bucket: bucket,
      Fields: { key: `${Date.now()}${key || "image.jpg"}` },
      Expires: 300,
    });
  }

  public static createPresignedUrl(url: string) {
    const [bucket, key] = url.split("/").slice(-2);
    console.log("BUCKET", bucket);
    console.log("key", key);
    return s3.getSignedUrlPromise("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 600,
    });
  }

  public static deleteObject(url: string) {
    const [bucket, key] = url.split("/").slice(-2);
    console.log("BUCKET", bucket);
    console.log("key", key);
    return new Promise<void>((resolve, reject) =>
      s3.deleteObject({ Key: key, Bucket: bucket }, (err, data) => {
        if (err) {
          console.log("err while deleting", err);
          reject(err);
          return;
        }
        console.log("successfully deleted image", data);
        resolve();
      })
    );
  }
}
