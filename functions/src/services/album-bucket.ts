import {Inject, Service} from "typedi";
import {Logger} from "../interfaces";
import {UploadMetadata} from "firebase/storage";
import {Bucket, UploadResponse} from "@google-cloud/storage";
import {v4} from "uuid";

@Service()
export class AlbumBucketService {
  @Inject("Logger")
  private readonly logger: Logger;

  @Inject("AlbumBucket")
  private readonly bucket: Bucket;

  async uploadFile(
      path: string,
      filename: string,
      metadata: UploadMetadata,
  ): Promise<UploadResponse> {
    return this.bucket.upload(path, {
      public: true,
      destination: `cdn/albums/${filename}`,
      metadata: {
        firebaseStorageDownloadTokens: v4(),
        ...metadata,
      },
    });
  }
}
