import { prisma } from "../prismaClient";
import {
  deleteImageFileFromBucket,
  listBucketVideosFiles,
  uploadFile,
} from "../utils/s3";
import { ErrorResponse, SuccessResponse } from "../utils/statusmessage";

export async function handleListImage(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    await prisma.image
      .findMany()
      .then(async (dbresolve) => {
        //console.log(dbresolve);
        res.send(new SuccessResponse(200, "Success", dbresolve));
      })
      .catch(async (dbreject) => {
        //console.log(dbreject);
        res.send(new ErrorResponse(400, String(dbreject)));
      });
  } catch (err) {
    //console.log(err);
    res.send(new ErrorResponse(404, String(err)));
  }
}

export async function handleImageTableFieldsName(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));

    res.send(new SuccessResponse(200, "Success", prisma.image.fields));
  } catch (err) {
    //console.log(err);
    res.send(new ErrorResponse(404, String(err)));
  }
}

export async function handleUploadImage(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    const file = req.file;
    const imageName = `${file.originalname}`;
    const filetype = `${file.mimetype}`;
    //console.log("filetype",filetype);
    const fileBuffer = file.buffer;
    await prisma.image
      .create({ data: { image_name: imageName } })
      .then(async (dbresolve) => {
        //console.log(dbresolve);
        await uploadFile(
          fileBuffer,
          `users/uploads/images/category/mahashivaratri/${dbresolve.id}`,
          filetype
        )
          .then((s3resolve) => {
            //console.log(s3resolve);
            res.send(new SuccessResponse(200, "Success", s3resolve));
          })
          .catch((s3reject) => {
            //console.log(s3reject);
            res.send(new ErrorResponse(400, String(s3reject)));
          });
      })
      .catch((dbreject) => {
        //console.log(dbreject)
        res.send(new ErrorResponse(404, String(dbreject)));
      });
  } catch (err) {
    //console.log(err);
    res.send(new ErrorResponse(400, String(err)));
  }
}

// Deleting the image from both bucket and database ,But first is from Bucket an then database

export async function handleDeleteImage(req: any, res: any, next: any) {
  if (!req) return res.send(new ErrorResponse(404, "No Request Found"));
  try {
    console.log(req.params);
    const image_id = req.params.imageid;
    console.log(image_id);
    await prisma.image
      .delete({
        where: {
          id: image_id,
        },
      })
      .then((dbresolve) => {
        console.log(dbresolve);
        return new SuccessResponse(200, "Success", dbresolve);
      })
      .catch((dbreject) => {
        console.log(dbreject);
        return new ErrorResponse(404, "Issue in DB");
      });
  } catch (err) {
    //console.log(err);
    res.send(new ErrorResponse(400, String(err)));
  }
}

// End of code

// Code to delete the image from bucket and database both

export async function handleDeleteImageFromBucket(
  req: any,
  resp: any,
  next: any
) {
  if (!req) new ErrorResponse(404, "No Request Found");
  try {
    const imageid = req.params.imageid;
    console.log(imageid);
    await deleteImageFileFromBucket(imageid)
      .then(async (res: any) => {
        if (!res || res["$metadata"]["httpStatusCode"] != 204) return;
        try {
          await prisma.image
            .delete({
              where: {
                id: imageid,
              },
            })
            .then((dbresolve) => {
              console.log(dbresolve);
              return new SuccessResponse(200, "Success", dbresolve);
            })
            .catch((dbreject) => {
              console.log(dbreject);
              return new ErrorResponse(404, "Issue in DB");
            });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(async (rej) => {
        console.log(rej);
      });
  } catch (error) {
    return new ErrorResponse(500, "Internal server error");
  }
}

// End of code for delete the image from bucket and database both

export async function handleSearchVectors(req: any, res: any, next: any) {
  if (!req) return res.send(new ErrorResponse(404, "No Request Found"));
  try {
    console.log(req.params);
    const { vector_name } = req.params;
    await prisma.image
      .findMany({ where: { image_name: { startsWith: vector_name } } })
      .then(async (dbresolve) => {
        console.log(dbresolve);
        await prisma.$disconnect();
        res.send(new SuccessResponse(200, "Success", dbresolve));
      })
      .catch(async (dbreject) => {
        console.log(dbreject);
        await prisma.$disconnect();
        res.send(new ErrorResponse(404, String(dbreject)));
        process.exit(1);
      });
  } catch (err) {
    //console.log(err);
    res.send(new ErrorResponse(400, String(err)));
  }
}

export async function handleGetListImages(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    await prisma.image
      .findMany({})
      .then((dbresolve) => {
        console.log(dbresolve);
        res.status(200).send(dbresolve);
      })
      .catch((dbreject) => {
        res.status(400).send(dbreject);
        console.log(dbreject);
      });
  } catch (error) {
    res.status(400).send("Exception Occured on Database");
    console.log(error);
  }
}

export async function handleDashboardImageUploadFile(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const imagefile = req.file;
    console.log(imagefile);
    const imagefiletype = `${imagefile.mimetype}`;
    const imageName = `${imagefile.originalname}`;
    const imagebuffer = imagefile.buffer;
    await prisma.image
      .create({
        data: {
          image_name: imageName,
        },
      })
      .then(async (dbresolve) => {
        console.log(dbresolve);
        await uploadFile(
          imagebuffer,
          `users/uploads/images/category/mahashivaratri/${dbresolve.id}`,
          imagefiletype
        )
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
    res.status(400).send("Exception Occured on Database");
    console.log(error);
  }
}

export async function handleDashboardImageDelete(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const imageid = req.params.deleteId;
    console.log(imageid);
    await deleteImageFileFromBucket(imageid)
      .then(async (s3resolve) => {
        if (!s3resolve || s3resolve["$metadata"]["httpStatusCode"] != 204) res.status(400).send("Image can't be deleted");
        try {
          await prisma.image
            .delete({
              where: {
                id: imageid,
              },
            })
            .then((dbresolve) => {
              console.log(dbresolve);
              res.status(200).send("Image successfully deleted");
            })
            .catch((dbreject) => {
              console.log(dbreject);
               res.status(400).send("Image doesn't get deleted please contact admin");
            });
        } catch (error) {
          console.log(error);
          res.status(400).send("Image doesn't get deleted please contact admin");
        }
      })
      .catch((s3reject) => {
        console.log(s3reject);
        res.status(400).send("Image doesn't get deleted please contact admin");
      });
  } catch (error) {
    console.log(error);
    res.status(400).send("Image doesn't get deleted please contact admin");
  }
}
