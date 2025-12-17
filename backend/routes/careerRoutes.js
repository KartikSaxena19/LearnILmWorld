import express from "express";
import CareerApplication from "../models/CareerApplication.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/apply", async (req, res) => {
    try {
        const {
            name,
            education,
            role,
            email,
            phone,
            resumeBase64,
            resumeFileName,
        } = req.body;

        // ---------- Validation ----------
        if (!name || !education || !role || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!resumeBase64) {
            return res.status(400).json({ message: "Resume is required" });
        }

        if (!process.env.ADMIN_VERIFICATION_EMAIL) {
            throw new Error("ADMIN_VERIFICATION_EMAIL is not set in .env");
        }

        // ---------- Save to DB ----------
        await CareerApplication.create({
            name,
            education,
            role,
            email,
            phone,
        });

        // ---------- Convert base64 → Buffer ----------
        const base64Data = resumeBase64.includes(",")
            ? resumeBase64.split(",")[1]
            : resumeBase64;

        const resumeBuffer = Buffer.from(base64Data, "base64");

        // ---------- Email body ----------
        const htmlBody = `
      <h2>New Career Application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Education:</strong> ${education}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `;

        // ---------- Send Email ----------
        await sendEmail({
            to: process.env.ADMIN_VERIFICATION_EMAIL, // ✅ CORRECT
            subject: `Career Application – ${role}`,
            html: htmlBody,
            attachments: [
                {
                    filename: resumeFileName || "resume.pdf",
                    content: resumeBuffer,
                },
            ],
        });

        // ✅ SUCCESS LOG
        console.log(
            `📧 Career email sent successfully | ${email} → ${process.env.ADMIN_VERIFICATION_EMAIL}`
        );

        res.status(200).json({
            message: "Application submitted successfully",
        });

    } catch (error) {
        console.error("❌ Career apply error:", error);
        res.status(500).json({
            message: "Something went wrong. Please try again later.",
        });
    }
});

export default router;
