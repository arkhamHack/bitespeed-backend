import { Request, Response, NextFunction } from "express";

export const validateIdentifyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, phoneNumber } = req.body;
  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ message: "Email or phoneNumber is required" });
  }

  next();
};
