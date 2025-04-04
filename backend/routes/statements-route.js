import express from "express";
import {Statement, Skill, Behaviour} from "../models/index.js"
const router = express.Router();

// Get all statements

    router.get("/", async (req, res) => {
        try {
          const statements = await Statement.findAll({
            include: [
              {
                model: Behaviour,
                attributes: ["id", "name"],
                include: [
                  {
                    model: Skill,
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          });
          res.json(statements);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
    
    
// Get statements by behaviour name
router.get("/:behaviourName", async (req, res) => {
    const { behaviourName } = req.params;
    try {
        const behaviour = await Behaviour.findOne({ where: { name: behaviourName } });
        if (!behaviour) {
            return res.status(404).json({ message: "Behaviour not found" });
        }
        const statements = await Statement.findAll({ where: { behaviourId: behaviour.id } });
        if (statements.length === 0) {
            return res.status(404).json({ message: "Statements not found for this behaviour" });
        }
        res.json(statements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
