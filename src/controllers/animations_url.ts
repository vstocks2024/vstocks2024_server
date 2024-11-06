import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { limit } from "../utils/types";
export async function handleGetAnimationsUrlListAll(
  req: any,
  res: any,
  next: any
) {
  if (!req) return res.status(404).send("Request Not Found");
  await prisma.animations_url
    .findMany({})
    .then((dbresolve) => {
      res.status(200).send(dbresolve);
    })
    .catch((dbreject) => {
      res.status(400).send(dbreject);
    });
}

export async function handleGetOneAnimation(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");

    const countAnimation: number = await prisma.animations_url.count({
      where: {
        orientation: "horizontal",
      },
    });
    const randNumber: number = Math.floor(Math.random() * countAnimation);
    await prisma.animations_url
      .findMany({
        take: 1,
        skip: randNumber,
        where: {
          orientation: "horizontal",
        },
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

export async function handleGetNewAddedAnimations(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const countAnimation: number = await prisma.animations_url.count({
      where: {
        orientation: "horizontal",
      },
    });
    const randNumber: number = Math.floor(Math.random() * (countAnimation - 4));
    await prisma.animations_url
      .findMany({
        take: 4,
        skip: randNumber,
        where: {
          orientation: "horizontal",
        },
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
export async function handleGetRecommended1Animations(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const countAnimation: number = await prisma.animations_url.count({
      where: {
        orientation: "horizontal",
      },
    });
    const randNumber: number = Math.floor(Math.random() * (countAnimation));
    await prisma.animations_url
      .findMany({
        take: 1,
        skip: randNumber,
        where: {
          orientation: "horizontal",
        },
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
export async function handleGetRecommended2Animations(
  req: any,
  res: any,
  next: any
) {
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const countAnimation: number = await prisma.animations_url.count({
      where: {
        orientation: "horizontal",
      },
    });
    const randNumber: number = Math.floor(Math.random() * (countAnimation - 4));
    await prisma.animations_url
      .findMany({
        take: 4,
        skip: randNumber,
        where: {
          orientation: "horizontal",
        },
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



export async function handleGetHomePageAnimation(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("Request Not Found");

    const countAnimation:number=await prisma.animations_url.count({
      where:{
        orientation:"horizontal"
      }
    })
    const randNumber:number = Math.floor(Math.random() * countAnimation);
    await prisma.animations_url
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


export async function handleGetAnimationsUrl(req:Request, res: Response, next: any){
  try {
    if (!req) return res.status(404).send("Request Not Found");
    const currentPage = Number(req.params.currentPage);
    const totalAnimations = await prisma.animations_url.count();

    const totalPages =
    totalAnimations / limit === Math.floor(totalAnimations / limit)
        ? Math.floor(totalAnimations / limit)
        : Math.floor(totalAnimations / limit) + 1;
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
      formats = [...formats, "mp4", "webm"];
    } 
    else {
      formats = [...formats, format];
    }

    if (sort === "relevance") {
      await prisma.animations_url
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
      await prisma.animations_url
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
      await prisma.animations_url
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
      await prisma.animations_url
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


export async function handleGetTotalAnimationPages(req: any, res: any, next: any){
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
      formats = [...formats, "mp4", "webm"];
    } 
    else {
      formats = [...formats, format];
    }
    const totalAnimations = await prisma.animations_url.count({
      where: {
        license: { in: licenses },
        orientation: { in: orientations },
        format: { in: formats },
      },
    });

    const totalPages =
    totalAnimations / limit === Math.floor(totalAnimations / limit)
        ? Math.floor(totalAnimations / limit)
        : Math.floor(totalAnimations / limit) + 1;
    res.status(200).send({ currentPage: currentPage, totalPages: totalPages });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}


