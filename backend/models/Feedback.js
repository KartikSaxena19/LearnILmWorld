import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        category: {
            type: String,
            enum: ["Bug Report", "Feature Request", "General Feedback"],
            required: true,
        },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
