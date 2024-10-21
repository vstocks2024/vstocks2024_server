import { prisma } from "../prismaClient";
import { limit } from "../utils/types";

export async function handleGetCategoryByVector(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const vector_id = req.params.vectorId;
    await prisma.vector_category
      .findMany({
        select: {
          category_id: true,
        },
        where: {
          vector_id: vector_id,
        },
      })
      .then(async (dbresolve1) => {
        console.log(dbresolve1);
        await prisma.vector_category
          .findMany({
            select: {
              vector_id: true,
            },
            where: {
              OR: dbresolve1,
              NOT: {
                vector_id: vector_id,
              },
            },
          })
          .then(async (dbresolve2) => {
            await prisma.vectors_url
              .findMany({
                where: {
                  OR: dbresolve2,
                },
              })
              .then((dbresolve3) => {
                console.log(dbresolve3);
                res.status(200).send(dbresolve3);
              })
              .catch((dbreject3) => {
                res.status(400).send(dbreject3);
              });
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

export async function handleGetVectorByCategoryName(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const categoryname = req.params.currentCategoryName;
    const currentpage = req.params.currentPage;
    const license = req.params.currentLicense;
    const orientation = req.params.currentOrientation;
    const format = req.params.currentFormat;
    const sort = req.params.currentSort;

    let licenses: string[] = [];
    if (license === "all") {
      licenses = [...licenses, "free", "premium"];
    } else {
      licenses = [...licenses, license];
    }
    let orientations: string[] = [];
    if (orientation === "all") {
      orientations = [...orientations, "square", "horizontal", "vertical"];
    } else {
      orientations = [...orientations, orientation];
    }
    let formats: string[] = [];
    if (format === "all") {
      formats = [...formats, "ai", "svg", "jpeg", "jpg"];
    } else if(format==="jpeg"){
      formats = [...formats, "jpg","jpeg"];
    } 
    else {
      formats = [...formats, format];
    }
    await prisma.category
      .findUnique({
        select: {
          id: true,
        },
        where: {
          name: categoryname,
        },
      })
      .then(async (dbresolve1) => {
        await prisma.vector_category
          .findMany({
            skip: (currentpage - 1) * limit,
            take: limit,
            select: {
              vector_id: true,
            },
            where: {
              category_id: dbresolve1?.id,
            },
          })
          .then(async (dbresolve2) => {
            let vector_id_arr: string[] = [];
            dbresolve2.forEach((ele) => {
              vector_id_arr = [...vector_id_arr, ele.vector_id];
            });
            if (sort === "relevance") {
              await prisma.vectors_url
                .findMany({
                  where: {
                    vector_id: { in: vector_id_arr },
                    license: { in: licenses },
                    orientation: { in: orientations },
                    format: { in: formats },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                })
                .then((dbresolve3) => {
                  res.status(200).send(dbresolve3);
                })
                .catch((dbreject3) => {
                  console.log(dbreject3);
                  res.status(400).send(dbreject3);
                });
            } else if (sort === "alpha") {
              await prisma.vectors_url
                .findMany({
                  where: {
                    vector_id: { in: vector_id_arr },
                    license: { in: licenses },
                    orientation: { in: orientations },
                    format: { in: formats },
                  },
                  orderBy: {
                    name: "asc",
                  },
                })
                .then((dbresolve3) => {
                  res.status(200).send(dbresolve3);
                })
                .catch((dbreject3) => {
                  console.log(dbreject3);
                  res.status(400).send(dbreject3);
                });
            } else if (sort === "popular") {
              await prisma.vectors_url
                .findMany({
                  where: {
                    vector_id: { in: vector_id_arr },
                    license: { in: licenses },
                    orientation: { in: orientations },
                    format: { in: formats },
                  },
                  orderBy: {
                    likes: "desc",
                  },
                })
                .then((dbresolve3) => {
                  res.status(200).send(dbresolve3);
                })
                .catch((dbreject3) => {
                  console.log(dbreject3);
                  res.status(400).send(dbreject3);
                });
            } else if (sort === "date") {
              await prisma.vectors_url
                .findMany({
                  where: {
                    vector_id: { in: vector_id_arr },
                    license: { in: licenses },
                    orientation: { in: orientations },
                    format: { in: formats },
                  },
                  orderBy: {
                    createdAt: "asc",
                  },
                })
                .then((dbresolve3) => {
                  res.status(200).send(dbresolve3);
                })
                .catch((dbreject3) => {
                  console.log(dbreject3);
                  res.status(400).send(dbreject3);
                });
            }
          })
          .catch((dbreject2) => {
            console.log(dbreject2);
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

export async function handleGetTotalVectorPagesByCategoryName(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    let totalVectors: number = 0;
    const currentpage: number = Number(req.params.currentPage);
    const categoryname: string = req.params.currentCategoryName;
    const license:string = req.params.currentLicense;
    const orientation:string = req.params.currentOrientation;
    const format:string = req.params.currentFormat;
    
    let licenses: string[] = [];
    if (license === "all") {
      licenses = [...licenses, "free", "premium"];
    } else {
      licenses = [...licenses, license];
    }
    let orientations: string[] = [];
    if (orientation === "all") {
      orientations = [...orientations, "square", "horizontal", "vertical"];
    } else {
      orientations = [...orientations, orientation];
    }
    let formats: string[] = [];
    if (format === "all") {
      formats = [...formats, "ai", "svg", "jpeg", "jpg"];
    } else if(format==="jpeg"){
      formats = [...formats, "jpg","jpeg"];
    } 
    else {
      formats = [...formats, format];
    }

    await prisma.category
      .findUnique({
        where: {
          name: categoryname,
        },
      })
      .then(async (dbresolve1) => {
        await prisma.vector_category
          .findMany({
            select:{
              vector_id:true
            },
            where: {
              category_id: dbresolve1?.id,
            },
          })
          .then(async(dbresolve2) => {
            let vector_id_arr: string[] = [];
            dbresolve2.forEach((ele) => {
              vector_id_arr = [...vector_id_arr, ele.vector_id];
            });
            await prisma.vectors_url.count({
              where:{
                vector_id: { in: vector_id_arr },
                license: { in: licenses },
                orientation: { in: orientations },
                format: { in: formats },
              }
            }).then((dbresolve3)=>{
              totalVectors = dbresolve3;
              const totalPages =
                totalVectors / limit === Math.floor(totalVectors / limit)
                  ? Math.floor(totalVectors / limit)
                  : Math.floor(totalVectors / limit) + 1;
              res
                .status(200)
                .send({ currentPage: currentpage, totalPages: totalPages });
            }).catch((dbreject3)=>{
              console.log(dbreject3);
              res.status(400).send(dbreject3);    
            })
          
          }).catch((dbreject2) => {
            console.log(dbreject2);
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
