import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Express-oda default Request interface-ah extend panrom,
// so that request body-la "admin" object-ah attach panna mudiyum.
export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    username: string;
    role: string;
  };
}

export const verifyAdminToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Header check panrom (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // 2. Token values split panni edukurom
    const token = authHeader.split(" ")[1];
    
    // 3. Make sure token is not undefined
    if (!token) {
      res.status(401).json({ message: "Access denied. Token format invalid." });
      return;
    }
    
    // 4. Verify jwt token signature
    const decoded = jwt.verify(
      token,
      (process.env.JWT_SECRET || "sri_sai_hospital_secret_key") as string
    ) as any;

    // 5. Check if the user is indeed an admin
    if (decoded.role !== "admin" && decoded.role !== "super-admin") {
      res.status(403).json({ message: "Access forbidden. Admin role required." });
      return;
    }

    // 6. Decoded details request logic layer-la pass panrom
    req.admin = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
