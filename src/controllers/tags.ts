import { prisma } from "../prismaClient";

export async function handleAddNewTag(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const bodyData = req.body;
    const { name, description } = bodyData;

    await prisma.tags
      .create({
        data: { name: name, description: description },
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
    console.log(error);
    res.status(404).send(error);
  }
}

export async function handleListAllTags(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const alltags = await prisma.tags.findMany({});
    res.status(200).send(alltags);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
}

export async function handleDeleteTag(req: any, res: any, next: any) {
  try {
    if (!req) return res.status(404).send("No Request Found");
    const deleteId = req.params.deleteId;
    await prisma.tags
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
        res.status(400).send(dbreject);
      });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
}

export async function handleGetTagIdAndName(req: any, res: any, next: any) {
  try {
    if (!req) res.status(404).send("Request Not Found");
    await prisma.tags
      .findMany({
        select: {
          id: true,
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

export async function handleUpdateTag(req: any, res: any, next: any) {
  try {
    if (!req) res.status(404).send("Request Not Found");
    const bodyData = req.body;
    const { id, name, description } = bodyData;
    // console.log("ID:", id);
    // console.log("Name:", name);
    // console.log("Description:", description);
    await prisma.tags
      .update({
        where: {
          id: id,
        },
        data: {
          name: "#".concat(name),
          description: description,
        },
      })
      .then((dbresolve) => {
        console.log(dbresolve);
        res.sendStatus(200);
      })
      .catch((dbreject) => {
        res.status(400).send(dbreject);
      });
  } catch (error) {
    res.status(404).send(error);
  }
}

export async function handleGetRandomTags(req: any, res: any, next: any) {
  try {
    if (!req) return  res.status(404).send("Request Not Found");
    const countTags:number=await prisma.tags.count({});
    const randomnumber: number = Math.floor(Math.random() * countTags);
    console.log(randomnumber);
    await prisma.tags
      .findMany({
        take: 5,
        skip: randomnumber,
      })
      .then((dbresolve) => {
        res.status(200).send(dbresolve);
      })
      .catch((dbreject) => {
        res.status(400).send(dbreject);
      });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
}
