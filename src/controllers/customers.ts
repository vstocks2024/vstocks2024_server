import { prisma } from "../prismaClient";
import { Request,Response } from "express";
import { supabase } from "../supabaseClient";

export async function handleListAllCustomers(req:Request,res:Response,next:any){
    try{
      if(!req) return;
     res.status(200).send([]);
    }
    catch(error){
        console.log(error);
        throw new Error("Exception Occured");
    }

}