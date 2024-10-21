import { prisma } from "../prismaClient";

export async function handleGetTagsIdAndName(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    await prisma.tags
      .findMany({})
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
