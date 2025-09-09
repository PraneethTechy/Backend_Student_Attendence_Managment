// middlewares/verifyToken.js
import Teacher from '../models/Teacher.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  let token = req.headers.token || req.headers.authorization;

  // If Authorization header exists, extract Bearer token
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    req.Id = teacher._id; // attach teacher ID for controllers
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyToken;
