import {prisma} from '../prismaClient';
import { getObjectSignedUrl,listBucketVideosFiles, uploadFile } from '../utils/s3';
import { ErrorResponse, SuccessResponse } from '../utils/statusmessage';

export async function handleListImage(req:any,res:any,next:any)
{
    try{
        if(!req) return res.send(new ErrorResponse(404,"Not Found"))
        await prisma.image.findMany()
       .then(async(dbresolve)=>{
        console.log(dbresolve);
        res.send(new SuccessResponse(200,"Success",dbresolve));
        })
        .catch(async(dbreject)=>
        {
            console.log(dbreject);
            res.send(new ErrorResponse(400,String(dbreject)));
        })
    }
    catch(err){
    console.log(err);
    res.send(new ErrorResponse(404,String(err)));
    }
}
export async function handleUploadImage(req:any,res:any,next:any)
{
    try{
        if(!req) return res.send(new ErrorResponse(404,"Not Found"))
        const file = req.file
        const imageName = `${file.originalname}`;
        const filetype=`${file.mimetype}`
        console.log("filetype",filetype);
        const fileBuffer = file.buffer;
        await prisma.image.create({data:{image_name:imageName}})
        .then(async (dbresolve)=>
        {
            console.log(dbresolve);
            await uploadFile(fileBuffer,`users/uploads/images/category/mahashivaratri/${dbresolve.id}`,filetype)
            .then((s3resolve)=>
            {
                console.log(s3resolve);
                res.send(new SuccessResponse(200,"Success",s3resolve))
            })
            .catch((s3reject)=>
            {
                console.log(s3reject);
                res.send(new ErrorResponse(400,String(s3reject)))
            })
        })
        .catch((dbreject)=>{
          console.log(dbreject)
         res.send(new ErrorResponse(404,String(dbreject)));
         });
        }
    catch(err){
        console.log(err);
        res.send(new ErrorResponse(400,String(err)))
    }
}

export async function handleDeleteImage(req:any,res:any,next:any)
{

}