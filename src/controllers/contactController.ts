import { Request, Response } from "express";
import { findOrCreateContact } from "../providers/contactService";

export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;
  const result = await findOrCreateContact(email, phoneNumber);

  return res.json({
    contact: result,
  });
};
