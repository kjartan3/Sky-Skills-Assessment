import express from "express";
import { Behaviour } from "../models/index.js";

const router = express.Router();

// Get all behaviours
router.get("/", async (req, res) => {
    try {
        const behaviours = await Behaviour.findAll();
        res.json(behaviours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:behaviourId", async (req, res) => {
    const { behaviourId } = req.params;
    try {
        const behaviour = await Behaviour.findByPk(behaviourId);
        if (!behaviour) {
            return res.status(404).json({ message: "Behaviour not found" });
        }
        res.json(behaviour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;
