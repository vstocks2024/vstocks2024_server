import { prisma } from "../prismaClient";
import { ErrorResponse, SuccessResponse } from "../utils/statusmessage";
import { supabase } from "../supabaseClient";

export async function handleAddNewCategory(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    const bodyData = req.body;
    await prisma.category
      .create({
        data: bodyData,
      })
      .then((dbresolve) => {
        console.log("DBRESOLVE:", dbresolve);
        res.status(201).send(dbresolve);
      })
      .catch((dbreject) => {
        console.log("DBREJECT:", dbreject);
        res.status(202).send(dbreject);
      });
  } catch (error) {
    res.send(error);
  }
}

export async function handleGetCategoryData(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    await prisma.category
      .findMany()
      .then((dbresolve) => {
        res.send(dbresolve);
      })
      .catch((dbreject) => {
        res.send(dbreject);
      });
  } catch (error) {
    res.send(new ErrorResponse(404, String(error)));
  }
}

export async function handleDeleteCategory(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    const deleteId = req.params.deleteId;
    await prisma.category
      .delete({
        where: {
          id: deleteId,
        },
      })
      .then((dbresolve) => {
        console.log(dbresolve);
        res.sendStatus(200);
      })
      .catch((dbreject) => {
        console.log(dbreject);
        res.status(202).send(dbreject);
      });
  } catch (error) {
    res.status(404).send(error);
  }
}

export async function handleUpdateCategory(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const bodyData = req.body;
    
    await prisma.category.update({
        where: {
            id:bodyData.id,
          },
          data: {
            name:bodyData.name,
            description:bodyData.description,
          },
    })
    .then((dbresolve) => {
      res.sendStatus(200);
    })
    .catch((dbreject) => {
        res.status(404).send(dbreject);
    })
  } catch (error) {
    res.status(404).send(error);
  }
}

export async function handleGetCategoryDataById(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    const categoryId = req.params.categoryId;
    await prisma.category
      .findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      })
      .then((dbresolve) => {
        // if(dbresolve===null)
        console.log(dbresolve);
      })
      .catch((dbreject) => {
        console.log(dbreject);
      });
  } catch (error) {
    res.status(404).send(error);
  }
}

export async function handleGetCategoryIdAndName(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) res.status(404).send("Request Not Found");
    await prisma.category
      .findMany({
        select: {
          id : true ,
          name: true,
        },
      })
      .then((dbresolve) => {
        console.log(dbresolve);
        res.status(200).send(dbresolve);
      })
      .catch((dbreject) => {
        console.log(dbreject);
        res.status(400).send(dbreject);
      });
  } catch (error) {
    res.status(404).send(error);
  }
}

export async function handleSupabaseGet(req: any, res: any, next: any) {
  let { data, error } = await supabase.from("Category").select("*");
  console.log("Data",data)
  console.log("Error",error);
  res.status(200).send(data);
}


