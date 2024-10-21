import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.VSTOCKS_BUCKET_NAME as string;
const region = process.env.VSTOCKS_REGION as string;
const accessKeyId = process.env.VSTOCKS_ROOT_ACCESS_KEY as string;
const secretAccessKey = process.env.VSTOCKS_ROOT_SECRET_KEY as string;

export function listBucketVideosFiles() {
  const params = {
    Bucket: bucketName,
    Prefix: `users/uploads/videos`,
  };
  return s3Client.send(new ListObjectsCommand(params));
}
export function listBucketImagesFiles() {
  const params = {
    Bucket: bucketName,
    Prefix: `users/uploads/images`,
  };
  return s3Client.send(new ListObjectsCommand(params));
}
export function listBucketAllFiles() {
  const params = {
    Bucket: bucketName,
  };
  return s3Client.send(new ListObjectsCommand(params));
}
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimetype: string
) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}

export function deleteFile(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: `users/uploads/videos/category/mahashivaratri/${fileName}`,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

//  export async function getObjectSignedUrl(key:string) {
//   const params = {
//     Bucket: bucketName,
//     Key: key
//   }

//   const command = new GetObjectCommand(params);
//   const seconds = 60
//   const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

//   return url
// }

export const deleteVideoFileFromBucket = async (fileName: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: `users/uploads/videos/category/mahashivaratri/${fileName}`,
  });
  try {
    return await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
};

export const deleteImageFileFromBucket = async (fileName: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: `users/uploads/images/category/mahashivaratri/${fileName}`,
  });

  try {
    return await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
};

export const deleteVectorFileFromBucket = async (fileName: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: `vectors/${fileName}`,
  });
  try {
    return await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
};


export const getVectorFile =async(fileName:string)=>{
  const command=new GetObjectCommand({
    Bucket:bucketName,
    Key:`vectors/${fileName}`
  });
}