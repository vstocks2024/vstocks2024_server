import { Response } from "express";
import jwt from "jsonwebtoken";
const generateAdminTokenAndSetCookie = (adminId: string, res:Response) => {
  const token = jwt.sign({ adminId }, process.env.JWT_ADMIN_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(200).cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, 
    // sameSite: "strict", 
    // secure: process.env.NODE_ENV !== "development",
  });
};

export default generateAdminTokenAndSetCookie;
