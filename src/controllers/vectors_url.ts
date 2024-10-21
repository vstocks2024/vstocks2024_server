import { prisma } from "../prismaClient";
import { limit } from "../utils/types";

export async function handleGetVectorsNameSearch(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const currentSearchWord: string = req.params.currentSearchWord;
    await prisma.vectors_url
      .findMany({
        where: {
          name: {
            contains: currentSearchWord,
            mode: "insensitive",
          },
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
    console.log(error);
    res.status(400).send(error);
  }
}

export async function handleGetHomePageVector(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");

    const countVector:number=await prisma.vectors_url.count({
      where:{
        orientation:"horizontal"
      }
    })
    const randNumber:number = Math.floor(Math.random() * countVector);
    await prisma.vectors_url
      .findMany({
        take: 1,
        skip: randNumber,
        where:{
          orientation:"horizontal"
        }
      })
      .then((dbresolve) => {
        res.status(200).send(dbresolve);
      })
      .catch((dbreject) => {
        res.status(400).send(dbreject);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
