import bcrypt from "bcryptjs";
import { prisma } from "../prismaClient";
import generateAdminTokenAndSetCookie from "../utils/generateAdminToken";
import { Request, Response ,NextFunction } from "express";
export async function handleAddNewAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      fullname,
      adminname,
      email,
      phone,
      password,
      confirmpassword,
    } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const admin = await prisma.adminProfiles.findUnique({
      where: {
        adminname: adminname,
      },
    });

    if (admin) {
      return res
        .status(400)
        .json({ message: "Admin name already exists try something different"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newadmin = await prisma.adminProfiles.create({
      data: {
        fullname,
        adminname,
        email,
        phone,
        password: hashedPassword,
        imageurl:`https://avatar.iran.liara.run/public/boy?username=${adminname}`,
      },
    });
    if (newadmin) {
      res.status(201).json({ message:"New Admin Created" });
    }
  } catch (error) {
    console.log("Error in admin controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function handleAdminLogin(req: Request, res: Response, next: any) {
  try {
    // console.log(typeof req.body);
    const { adminname, password } = req.body;
    const admin = await prisma.adminProfiles.findUnique({
      where: {
        adminname: adminname,
      },
    });
    if (!admin) return res.status(400).json({ error: "Invalid Admin Name" });
    else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        admin.password || ""
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid password" });
      }
    }

    generateAdminTokenAndSetCookie(admin.id, res);

    res
      .status(200)
      .send({
        adminId: admin.id,
        adminName: admin.adminname,
        fullName: admin.fullname,
        adminEmail: admin.email,
        adminPhone: admin.phone,
        imageUrl: admin.imageurl,
      });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function handleAdminLogout(req: any, res: Response, next: any) {
  try {
    res.clearCookie("jwt");
    // res.cookie("jwt","",{maxAge:0});
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
