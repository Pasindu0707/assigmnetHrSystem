import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

// Upload a profile picture (Used in Employee registration/update)
router.post("/", upload.single("profilePicture"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

export default router;
