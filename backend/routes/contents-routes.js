import express from "express";
import { Content } from "../models/index.js";

const router = express.Router();

// Get all behaviours
router.get("/", async (req, res) => {
    try {
        const contents = await Content.findAll();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:contentId", async (req, res) => {
    const { contentId } = req.params;
    try {
        const content = await Content.findByPk(contentId);
        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;