import express from "express";
import { 
  registerUser,        // <-- Fixed the name!
  loginUser,           // <-- Fixed the name!
  getUserProfile,      
  updateUserProfile    
} from "../controllers/authController.js"; 
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerUser); // <-- Updated to use registerUser
router.post("/login", loginUser);       // <-- Updated to use loginUser

// Profile routes
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;