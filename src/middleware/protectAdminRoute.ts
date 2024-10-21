import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../prismaClient";
export async function protectAdminRoute(req:Request,res:Response,next:any){
    try {
        const token=req.cookies.jwt;
        if(!token) return res.status(401).json({error:"Unauthorized No Token Provided"});
        const decoded=jwt.verify(token, process.env.JWT_ADMIN_SECRET as string);
        console.log(decoded);
        if(!decoded) res.status(401).json({error:"Unauthorized Invalid Token"})
    //         const admin=await prisma.adminProfiles.findUnique({
    //         select:{
    //             adminname:true,
    //          fullname:true,
    //          imageurl:true,
    //     },
    // where:{
    //     adminname:decoded.id
    // }})
    } catch (error) {
        console.log(error);
     }

}