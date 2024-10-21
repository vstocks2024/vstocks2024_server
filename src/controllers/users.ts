import {prisma} from '../prismaClient';
import { uploadFile } from '../utils/s3';
import { ErrorResponse, SuccessResponse } from '../utils/statusmessage';


export async function handleLoginUser(req:any,res:any,next:any){
    if(!req) return new ErrorResponse(404,"No Request Found");
    try{
       
    }
    catch(error){
        console.log(error);
    }

}


export async function handleDeleteUser(req:any,res:any,next:any)
{
    
}

export async function handleUserUploadImage(req:any,res:any,next:any)
{
    try {
        if (!req) return res.send(new ErrorResponse(404, "Not Found"));
        const file = req.file;
        const imageName = `${file.originalname}`;
        const filetype = `${file.mimetype}`;
        //console.log("filetype",filetype);
        const fileBuffer = file.buffer;
        await prisma.image
          .create({ data: { image_name: imageName } })
          .then(async (dbresolve) => {
            //console.log(dbresolve);
            await uploadFile(
              fileBuffer,
              `users_uploaded_images/${dbresolve.id}`,
              filetype
            )
              .then((s3resolve) => {
                //console.log(s3resolve);
                res.send(new SuccessResponse(200, "Success", s3resolve));
              })
              .catch((s3reject) => {
                //console.log(s3reject);
                res.send(new ErrorResponse(400, String(s3reject)));
              });
          })
          .catch((dbreject) => {
            //console.log(dbreject)
            res.send(new ErrorResponse(404, String(dbreject)));
          });
      } catch (err) {
        //console.log(err);
        res.send(new ErrorResponse(400, String(err)));
      }
}

