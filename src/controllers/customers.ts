import { prisma } from "../prismaClient";

export async function handleListAllCustomers(req:any,res:any,next:any){
    try{
        if(!req) res.status(404).send("No Request Found");
        console.log(req);
        await prisma.userProfiles.findMany({})
        .then((dbresolve)=>{
            console.log(dbresolve);
            res.status(200).send(dbresolve);
        })
        .catch((dbreject)=>{
            console.log(dbreject);
            res.status(400).send(dbreject)
        })

    }
    catch(error){
        console.log(error);
        throw new Error("Exception Occured");
    }

}