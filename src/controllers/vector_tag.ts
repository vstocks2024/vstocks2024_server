import { prisma } from "../prismaClient";

export async function handleGetTagByVector(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const vector_id = req.params.vectorId;
    await prisma.vector_tag
      .findMany({
        select:{
          tag_id:true
        },
        where: {
          vector_id: vector_id,
        },
      })
      .then(async (dbresolve1) => {
        console.log(dbresolve1);
        let tag_id_arr:string[]=[];
        dbresolve1.forEach((item)=>{
          tag_id_arr=[...tag_id_arr,item.tag_id];
        })

        await prisma.tags
          .findMany({
          where:{
            id :{ in : tag_id_arr}
          }
          })
          .then((dbresolve2) => {
            console.log(dbresolve2);
            res.status(200).send(dbresolve2);
          })
          .catch((dbreject2) => {
            res.status(400).send(dbreject2);
          });
      })
      .catch((dbreject1) => {
        console.log(dbreject1);
        res.status(400).send(dbreject1);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
