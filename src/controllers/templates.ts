import {prisma} from '../prismaClient';
import { ErrorResponse, SuccessResponse } from '../utils/statusmessage';
export async function handleCreateTemplate(req:any,res:any,next:any)
{
    try{
        if(!req) return res.send(new ErrorResponse(404,"Not found"))
         let body=req.body;
        await prisma.template.create({data:{template_data:body}})
        .then(async (dbresolve) => {
         console.log(dbresolve)
         await prisma.$disconnect()
          res.send(new SuccessResponse(200,"Success",dbresolve));
        })
         .catch(async (dbreject) => {
         console.error(dbreject)
        await prisma.$disconnect()
        res.send(new ErrorResponse(400,String(dbreject)))
        process.exit(1)
        })
     }
    catch(err)
    {
        console.log(err);
        res.send(new ErrorResponse(400,String(err)));
    }
}


export async function handleGetTemplateById(req:any,res:any,next:any)
{
try{
    if(!req) return res.send(new ErrorResponse(404,"Not found"))
    const {template_id}=req.params
    await prisma.template.findUnique({where:{id:`${template_id}`}})
    .then(async (dbresolve) => {
    console.log(dbresolve)
    await prisma.$disconnect()
    res.status(200).send(dbresolve);
    })
    .catch(async (dbreject) => {
    console.log(dbreject);
    await prisma.$disconnect()
    res.send(new ErrorResponse(400,String(dbreject)));
    process.exit(1)
    })
}

catch(err)
{
    console.log(err);
    res.send(new ErrorResponse(400,String(err)));
}
}

export async function handleUpdateTemplate(req:any,res:any,next:any)
{
    try{
        if(!req) return res.send(new ErrorResponse(404,"Not Found"))
        const {template_id,element_id}=req.params;
        console.log(template_id);
        console.log(element_id);
        res.send(new SuccessResponse(200,"ok",{template_id,element_id}));

    }
    catch(err){
        console.log(err);
        res.send(new ErrorResponse(400,String(err)));
    }
}

