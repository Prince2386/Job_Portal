import multer from "multer";

// Store the file in memory as a Buffer so ImageKit can read it
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;