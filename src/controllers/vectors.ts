import { prisma } from "../prismaClient";
import { deleteVectorFileFromBucket, uploadFile } from "../utils/s3";
import { limit } from "../utils/types";
import { Request, Response } from "express";
import sizeOf from "image-size";

// export async function handleAddNewVector(req: any, res: any, next: any) {
//   try {
//     if (!req) return res.status(404).send("Request Not Found");
//     const vectorfile = req.file;
//     const vectortype = vectorfile.mimetype;
//     const format = vectorfile.mimetype.split("/");
//     const vectorbuffer = vectorfile.buffer;
//     const category_id = req.body.category_id;
//     const tag_id = req.body.tag_id;
//     const name = req.body.name;
//     const description = req.body.description;
//     await prisma.vectors
//       .create({
//         data: {
//           name: name,
//           description: description,
//           likes: 0,
//           shares: 0,
//           format: format[1],
//         },
//       })
//       .then(async (dbresolve) => {
//         const vector_id = dbresolve.id;
//         /////////Replace with stored procedure or trigger
//         await prisma.vectors_Category.create({
//           data: {
//             vector_id,
//             category_id,
//           },
//         });
//         await prisma.vectors_Tag.create({
//           data: {
//             vector_id,
//             tag_id,
//           },
//         });
//         //////////////////////////////////////////////////
//         await uploadFile(vectorbuffer, `vectors/${dbresolve.id}`, vectortype)
//           .then((s3resolve) => {
//             console.log("From S3 Resolve", s3resolve);
//             if (s3resolve[`$metadata`]["httpStatusCode"] === 200)
//               res.status(201).send("Created");
//             /////Write the code for Rollback  of above tables
//             //res.status(202).send("Accepted");
//           })
//           .catch((s3reject) => {
//             console.log("From S3 Reject", s3reject);
//             res.status(400).send("Request Not Completed");
//           });
//       })
//       .catch((dbreject) => {
//         console.log(dbreject);
//         res.status(400).send("Request Not Completed");
//       });
//   } catch (error) {
//     console.log(error);
//     throw new Error("Exception is raised");
//   }
// }

export async function handleGetVectorsList(req: Request, res: Response, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    await prisma.vectors
      .findMany({})
      .then((dbresolve) => {
        console.log("Resolve", dbresolve);
        res.status(200).send(dbresolve);
      })
      .catch((dbreject) => {
        console.log("Reject", dbreject);
        res.status(400).send(dbreject);
      });
  } catch (error) {
    console.log(error);
  }
}

export async function handleDeleteVector(req: Request, res: Response, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const deleteId = req.params.deleteId;
    await deleteVectorFileFromBucket(deleteId)
      .then(async (s3resolve) => {
        if (!s3resolve || s3resolve["$metadata"]["httpStatusCode"] != 204)
          return res.status(405).send("Vector deletion request not completed");
        await prisma.vectors
          .delete({
            where: {
              id: deleteId,
            },
          })
          .then((dbresolve) => {
            console.log(dbresolve);
            res.status(200).send("OK");
          })
          .catch((dbreject) => {
            console.log(dbreject);
            res.status(405).send("Vector deletion request not completed");
          });
      })
      .catch((s3reject) => {
        console.log(s3reject);
        res.status(405).send("Vector deletion request not completed");
      });
  } catch (error) {
    console.log(error);
    res.status(405).send("Vector deletion request not completed");
  }
}

export async function handleAddNew2Vector(req: any , res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");

    const name = req.body.name;
    const description = req.body.description;
    const categories = req.body.category_id;
    console.log(categories);
    const tags = req.body.tag_id;
    console.log(tags);
    const vectorfile = req.file;
    const vectortype = vectorfile.mimetype;
    const format = vectorfile.mimetype.split("/")[1];
    const vectorbuffer = vectorfile.buffer;
    await prisma.vectors
      .create({
        data: {
          name: name,
          description: description,
          likes: 0,
          shares: 0,
          format: format,
          width: 0,
          height: 0,
          license: "free",
          orientation: "Square",
        },
      })
      .then(async (dbresolve) => {
        console.log(dbresolve);
        await uploadFile(vectorbuffer, `vectors/${dbresolve.id}`, vectortype)
          .then((s3resolve) => {
            console.log("From S3 Resolve", s3resolve);
            if (s3resolve[`$metadata`]["httpStatusCode"] === 200)
              res.status(201).send("Created");
          })
          .catch((s3reject) => {
            console.log("From S3 Reject", s3reject);
            res.status(400).send("Request Not Completed");
          });
      })
      .catch((dbreject) => {
        console.log(dbreject);
        res.status(400).send("Request Not Completed");
      });
  } catch (error) {
    console.log(error);
  }
}

export async function handleAddNew3Vector(req:any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const name = req.body.name;
    const description = req.body.description;
    const categories = req.body.category_id;
    const tags = req.body.tag_id;
    const vectorfile = req.file;
    const vectortype = vectorfile.mimetype;
    const format = vectorfile.mimetype.split("/")[1];
    const vectorbuffer = vectorfile.buffer;
    const dimensions = sizeOf(vectorbuffer);
    const width = dimensions.width ? dimensions.width : 0;
    const height = dimensions.height ? dimensions.height : 0;
    let orientation = "";
    if (width > height) orientation = "horizontal";
    else if (width < height) orientation = "vertical";
    else orientation = "square";

    await prisma.vectors
      .create({
        data: {
          name: name,
          description: description,
          likes: 0,
          shares: 0,
          format: format,
          width: width,
          height: height,
          license: "free",
          orientation: orientation,
        },
      })
      .then(async (dbresolve1) => {
        let vectors_category_data: any[] = [];
        categories.forEach((element: any) => {
          vectors_category_data = [
            ...vectors_category_data,
            { vector_id: dbresolve1.id, category_id: element.value },
          ];
        });
        await prisma.vector_category
          .createMany({
            data: vectors_category_data,
          })
          .then(async (dbresolve2) => {
            console.log(dbresolve2);
            let vector_tag_data: any[] = [];
            tags.forEach((element: any) => {
              vector_tag_data = [
                ...vector_tag_data,
                { vector_id: dbresolve1.id, tag_id: element.value },
              ];
            });
            await prisma.vector_tag
              .createMany({
                data: vector_tag_data,
              })
              .then(async (dbresolve3) => {
                console.log(dbresolve3);
                await uploadFile(
                  vectorbuffer,
                  `vectors/${dbresolve1.id}`,
                  vectortype
                )
                  .then(async (s3resolve) => {
                    console.log("From S3 Resolve", s3resolve);
                    if (s3resolve[`$metadata`]["httpStatusCode"] === 200)
                      await prisma.vectors_url
                        .create({
                          data: {
                            vector_id: dbresolve1.id,
                            name: dbresolve1.name,
                            description: dbresolve1.description,
                            likes: dbresolve1.likes,
                            shares: dbresolve1.shares,
                            format: dbresolve1.format,
                            url: `${process.env.NEXT_PUBLIC_BUCKET_URL}/vectors/${dbresolve1.id}`,
                            width: dbresolve1.width,
                            height: dbresolve1.height,
                            license: dbresolve1.license,
                            orientation: dbresolve1.orientation,
                          },
                        })
                        .then(async (dbresolve4) => {
                          console.log(dbresolve4);
                          res.status(201).send(dbresolve1);
                        })
                        .catch((dbreject4) => {
                          console.log(dbreject4);
                          res.status(400).send(dbreject4);
                        });
                  })
                  .catch((s3reject) => {
                    console.log("From S3 Reject", s3reject);
                    res.status(400).send(s3reject);
                  });
              })
              .catch((dbreject3) => {
                console.log(dbreject3);
                res.status(400).send(dbreject3);
              });
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

export async function handleGetVectorsUrl(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const currentPage = req.params.currentPage;
    const totalVectors = await prisma.vectors_url.count();

    const totalPages =
      totalVectors / limit === Math.floor(totalVectors / limit)
        ? Math.floor(totalVectors / limit)
        : Math.floor(totalVectors / limit) + 1;
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

    if (sort === "relevance") {
      await prisma.vectors_url
        .findMany({
          skip: limit * (currentPage - 1),
          take: limit,
          where: {
            license: { in: licenses },
            orientation: { in: orientations },
            format: { in: formats },
          },
          orderBy: {
            createdAt: "desc",
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
    } else if (sort === "popular") {
      await prisma.vectors_url
        .findMany({
          skip: limit * (currentPage - 1),
          take: limit,
          where: {
            license: { in: licenses },
            orientation: { in: orientations },
            format: { in: formats },
          },
          orderBy: {
            likes: "desc",
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
    } else if (sort === "alpha") {
      await prisma.vectors_url
        .findMany({
          skip: limit * (currentPage - 1),
          take: limit,
          where: {
            license: { in: licenses },
            orientation: { in: orientations },
            format: { in: formats },
          },
          orderBy: {
            name: "asc",
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
    } else if (sort === "date") {
      await prisma.vectors_url
        .findMany({
          skip: limit * (currentPage - 1),
          take: limit,
          where: {
            license: { in: licenses },
            orientation: { in: orientations },
            format: { in: formats },
          },
          orderBy: {
            createdAt: "asc",
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
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

export async function handleGetTotalVectorPages(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const currentPage: number = Number(req.params.currentPage);
    const license = req.params.currentLicense;
    const orientation = req.params.currentOrientation;
    const format = req.params.currentFormat;

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
    const totalVectors = await prisma.vectors_url.count({
      where: {
        license: { in: licenses },
        orientation: { in: orientations },
        format: { in: formats },
      },
    });

    const totalPages =
      totalVectors / limit === Math.floor(totalVectors / limit)
        ? Math.floor(totalVectors / limit)
        : Math.floor(totalVectors / limit) + 1;
    res.status(200).send({ currentPage: currentPage, totalPages: totalPages });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}


