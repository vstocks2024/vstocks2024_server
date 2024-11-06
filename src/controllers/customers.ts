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

export async function handleListAllCustomers1(req:Request,res:Response,next:any){
    try{
    if(!req) return;
    let { data, error } = await supabase.from("animations").select("*");
    if(error) throw error;
    res.status(200).send(data);
    }
    catch(error){
        console.log(error);
        throw new Error("Exception Occured");
    }

}