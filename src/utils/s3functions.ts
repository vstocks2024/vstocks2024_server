import  {S3Client,GetObjectCommand,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import  { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
dotenv.config();

const bucketName =process.env.VSTOCKS_BUCKET_NAME as string;
const region = process.env.VSTOCKS_REGION as string;
const accessKeyId = process.env.VSTOCKS_ACCESS_KEY as string;
const secretAccessKey = process.env.VSTOCKS_SECRET_KEY as string;

const s3Client=new S3Client({
    region,
    credentials:{
        accessKeyId,
        secretAccessKey}
})

export async function ObjectUrl(){

}

// export async function getObjectURL(key:string)
// {
//     const command=new GetObjectCommand({
//         Bucket:bucketName,
//         Key:key
//     });
//     const url= await getSignedUrl(s3Client,command);
//     return url;
// }
// export async function putObject(filename:string,contentType:string)
// {
// const command=new PutObjectCommand({
// Bucket:bucketName,
// Key:`uploads/user-uploads/${filename}`,
// ContentType:`${contentType}`
// });
// const url=await getSignedUrl(s3Client,command);
// return url;
// }




