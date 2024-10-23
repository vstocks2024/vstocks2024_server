import { prisma } from "../prismaClient";
import { uploadFile } from "../utils/s3";

export async function handleGetAnimationsList(req: any, res: any, next: any) {
  try {
    if (!req) res.status(404).send("No Request Found");
    await prisma.template
      .findMany({})
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

export async function handleDeleteAnimation(req: any, res: any, next: any) {
  try {
    if (!req) res.status(404).send("No Request Found");
    const animationId = req.params.deleteId;
    await prisma.animations
      .delete({
        where: {
          id: animationId,
        },
      })
      .then((dbresolve) => {
        console.log(dbresolve);
        res.sendStatus(200);
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

export async function handleCreateNewAnimation(req: any, res: any, next: any) {
  try {
    if (!req) res.status(404).send("No Request Found");
    const name: string = req.body.name;
    const description: string = req.body.description;
    const categories = req.body.category_id;
    const tags = req.body.tag_id;
    const thumbnail = req.file;
    const thumbnailbuffer = thumbnail.buffer;
    const thumbnailtype = thumbnail.mimetype;
    const format: string = "mp4";
    const license: string = req.body.license;
    const orientation: string = req.body.orientation;
    const template = req.body.template;
    const canvas_data=req.body.canvas_data;
    console.log(template);
    console.log(canvas_data);

    // console.log(name);
    // console.log(description);
    // console.log(category_id);
    // console.log(tag_id);
    // console.log(format);
    // console.log(license);
    // console.log(orientation);
    // console.log(template);
    await prisma.animations
      .create({
        data: {
          name: name,
          description: description,
          animation_data: template,
          canvas_data:canvas_data,
          license: license,
          orientation: orientation,
          format: format,
          likes: 0,
          shares: 0,
        },
      })
      .then(async (dbresolve1) => {
        console.log(dbresolve1);
        let animations_category_data: any[] = [];
        categories.forEach((element: any) => {
          animations_category_data = [
            ...animations_category_data,
            { animation_id: dbresolve1.id, category_id: element.value },
          ];
        });
        await prisma.animations_category
          .createMany({
            data: animations_category_data,
          })
          .then(async (dbresolve2) => {
            console.log(dbresolve2);
            let animation_tag_data: any[] = [];
            tags.forEach((element: any) => {
              animation_tag_data = [
                ...animation_tag_data,
                { animation_id: dbresolve1.id, tag_id: element.value },
              ];
            });
            await prisma.animations_tag
              .createMany({
                data: animation_tag_data,
              })
              .then(async (dbresolve3) => {
                console.log(dbresolve3);
                await uploadFile(
                  thumbnailbuffer,
                  `animations/${dbresolve1.id}`,
                  thumbnailtype
                )
                  .then(async (s3resolve) => {
                    console.log("From S3 Resolve", s3resolve);
                    if (s3resolve[`$metadata`]["httpStatusCode"] === 200)
                      await prisma.animations_url
                        .create({
                          data: {
                            animation_id: dbresolve1.id,
                            name: dbresolve1.name,
                            description: dbresolve1.description,
                            animation_data: template,
                            canvas_data:canvas_data,
                            likes: dbresolve1.likes,
                            shares: dbresolve1.shares,
                            format: dbresolve1.format,
                            thumbnail_url: `${process.env.NEXT_PUBLIC_BUCKET_URL}/animations/${dbresolve1.id}`,
                            license: dbresolve1.license,
                            orientation: dbresolve1.orientation,
                          },
                        })
                        .then(async (dbresolve4) => {
                          console.log(dbresolve4);
                          res.sendStatus(201);
                        })
                        .catch((dbreject4) => {
                          console.log(dbreject4);
                          res.status(400).send(dbreject4);
                        });
                  })
                  .catch((s3reject) => {
                    console.log(s3reject);
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

export async function handleGetAnimationDataById(
  req: any,
  res: any,
  next: any
) {
  if (!req) return res.sendStatus(404).end();
  try {
    const animationId: string = req.params.animationId;
    await prisma.animations
      .findUnique({
        where: {
          id: animationId,
        },
        select: {
          animation_data: true,
        },
      })
      .then((dbresolve) => {
        res.status(200).send(dbresolve);
      })
      .catch((dbreject) => {
        console.log(dbreject);
        res.status(400).send(dbreject);
      });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
}
