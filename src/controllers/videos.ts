import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import {
  deleteVideoFileFromBucket,
  listBucketVideosFiles,
  uploadFile,
} from "../utils/s3";
import { ErrorResponse, SuccessResponse } from "../utils/statusmessage";

export async function handleListVideo(req:Request, res: Response, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    await prisma.video
      .findMany()
      .then(async (dbresolve) => {
        ////console.log(dbresolve);
        // res.appennd("Access-Control-Allow-Origin")
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

export async function handleUploadVideo(req: any, res: any, next: any) {
  try {
    if (!req) return res.send(new ErrorResponse(404, "Not Found"));
    const file = req.file;
    const videoName = `${file.originalname}`;
    const filetype = `${file.mimetype}`;
    ////console.log("filetype",filetype);
    const fileBuffer = file.buffer;
    await prisma.video
      .create({ data: { video_name: videoName } })
      .then(async (dbresolve) => {
        //console.log(dbresolve);
        await uploadFile(
          fileBuffer,
          `users/uploads/videos/category/mahashivaratri/${dbresolve.id}`,
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

export async function handleDeleteVideoFromBucketAndDatabase(
  req: any,
  res: any,
  next: any
) {
  if (!req) new ErrorResponse(404, "No Request Found");
  try {
    const videoid = req.params.videoid;
    console.log(videoid);
    await deleteVideoFileFromBucket(videoid)
      .then(async (res: any) => {
        if (!res || res['$metadata']["httpStatusCode"] != 204) return;
        try {
          await prisma.video
            .delete({
              where: {
                id: videoid,
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

export async function handleDashboardUploadVideo(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const videofile = req.file;
    console.log(videofile);
    const videofiletype = `${videofile.mimetype}`;
    const videoName = `${videofile.originalname}`;
    const videobuffer = videofile.buffer;
    await prisma.video
      .create({
        data: {
          video_name: videoName,
        },
      })
      .then(async (dbresolve) => {
        console.log(dbresolve);
        await uploadFile(
          videobuffer,
          `users/uploads/videos/category/mahashivaratri/${dbresolve.id}`,
          videofiletype
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

export async function handleGetListVideos(req: any, res: any, next: any) {
  try {
    if (!req) res.status(404).send("No Request Found");
    await prisma.video
      .findMany({})
      .then(async (dbresolve) => {
        res.status(200).send(dbresolve);
      })
      .catch(async (dbreject) => {
        res.status(400).send(dbreject);
      });
  } catch (error) {
    console.log(error);
    throw new Error("Exception is raised");
  }
}

export async function handleDashboardVideoDelete(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const videoid = req.params.deleteId;
    console.log(videoid);
    await deleteVideoFileFromBucket(videoid)
      .then(async (s3resolve) => {
        if (!s3resolve || s3resolve["$metadata"]["httpStatusCode"] != 204)
          res.send(400).send("Video doesn't get deleted please contact admin");
        try {
          await prisma.video
            .delete({
              where: {
                id: videoid,
              },
            })
            .then((dbresolve) => {
              console.log(dbresolve);
              res.status(200).send("Video successfully deleted");
            })
            .catch((dbreject) => {
              console.log(dbreject);
              res
                .status(400)
                .send("Video doesn't get deleted please contact admin");
            });
        } catch (error) {
          console.log(error);
          res
            .status(400)
            .send("Video doesn't get deleted please contact admin");
        }
      })
      .catch((s3reject) => {
        console.log(s3reject);
        res.status(400).send("Video doesn't get deleted please contact admin");
      });
  } catch (error) {
    console.log(error);
    res.status(400).send("Video doesn't get deleted please contact admin");
  }
}
