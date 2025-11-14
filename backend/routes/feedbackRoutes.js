import express from "express";
import Feedback from "../models/Feedback.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// =============== PUBLIC: Submit Feedback ===============
router.post("/", async (req, res) => {
    try {
        const { name, email, category, message } = req.body;

        if (!name || !email || !category || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const feedback = new Feedback({ name, email, category, message });
        await feedback.save();

        res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res
            .status(500)
            .json({ error: "Something went wrong. Please try again later." });
    }
});

// =============== ADMIN-ONLY ROUTES ===============
router.use(authenticate, authorize(["admin"]));

// Fetch all feedbacks
router.get("/", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate("user", "name email");
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Failed to fetch feedbacks." });
    }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback)
            return res.status(404).json({ message: "Feedback not found." });

        await feedback.deleteOne();
        res.json({ message: "Feedback deleted successfully." });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res
            .status(500)
            .json({ message: "Server error while deleting feedback." });
    }
});

export default router;
