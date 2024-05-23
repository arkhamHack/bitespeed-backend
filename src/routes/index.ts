import { Router } from "express";
import { identifyContact } from "../controllers/contactController";
import { validateIdentifyRequest } from "../middleware/validate";

const router = Router();

router.post("/identify", validateIdentifyRequest, identifyContact);

export default router;
