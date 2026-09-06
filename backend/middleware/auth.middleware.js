import jwt from "jsonwebtoken";
import { configs } from "../src/config/config.js";

export function authUser(req, res, next) {
   const authHeader = req.headers.authorization;
   const token = authHeader?.split(" ")[1]; // bearer <token>

   if (!token) {
      return res.status(401).json({
         message: "Unauthorized",
         success: false,
      });
   }

   try {
      const decoded = jwt.verify(token, configs.JWT_ACCESS_SECRET);
      req.user = { id: decoded.id };

      next();
   } catch (err) {
      return res.status(401).json({
         message: "Unauthorized",
         success: false,
         err: "Invalid Token",
      });
   }
}
