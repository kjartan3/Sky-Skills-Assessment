import express from "express";
import Behaviour from "../models/behaviours.js";
import Skill from "../models/skills.js";

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

// Get behaviours by skill name
// router.get("/:skillName", async (req, res) => {
//     const { skillName } = req.params;
//     try {
//         const skill = await Skill.findOne({ where: { name: skillName } });
//         if (!skill) {
//             return res.status(404).json({ message: "Skill not found" });
//         }
//         const behaviours = await Behaviour.findAll({ where: { skillId: skill.id } });
//         if (behaviours.length === 0) {
//             return res.status(404).json({ message: "Behaviours not found for this skill" });
//         }
//         res.json(behaviours);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

export default router;
