import {prisma} from '../prismaClient';
import { ErrorResponse } from '../utils/statusmessage';

export async function  handleCreateUser(req:any,res:any,next:any){
    try{
    if(req){
    console.log(req.body);
    await prisma.user.create({data:req.body})
    .then(async (resolve) => {
    console.log(resolve)
    await prisma.$disconnect()
    res.status(200).send("OK");
    })
    .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
    })
    
}
else
{
    console.log("No request received");
    res.status(400).send("No request received");
}

}
catch(err:unknown){
    console.log(err);
    
}

}

export async function handleDeleteUser(req:any,res:any,next:any)
{
    
}


