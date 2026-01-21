import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
    onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function CareerApplicationForm({ onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"success" | "error" | null>(null);

    // 🔹 FORM STATES
    const [name, setName] = useState("");
    const [education, setEducation] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // 🔹 File → base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resumeFile) {
            alert("Resume is required");
            return;
        }

        try {
            setLoading(true);
            setStatus(null);

            const resumeBase64 = await fileToBase64(resumeFile);

            const payload = {
                name,
                education,
                role,
                email,
                phone,
                resumeBase64,
                resumeFileName: resumeFile.name,
            };

            const res = await fetch(`${API_URL}/api/careers/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#fef5e4] rounded-3xl p-8 w-[90%] max-w-xl text-gray-800 relative shadow-xl"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-3xl font-bold text-[#5186cd] hover:text-[#3f6fb0]"
                >
                    ×
                </button>

                <h2 className="text-3xl font-extrabold text-[#5186cd] mb-6 text-center">
                    Apply to Join LearniLM🌎World
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                    />

                    <input
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="Education (e.g. B.Tech, MBA)"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                    >
                        <option value="">Select Role</option>
                        <option value="Sales Intern - India">Sales Intern – India</option>
                        <option value="Digital Marketing Intern - India">Digital Marketing Intern – India</option>
                        <option value="UX/UI Designer Intern - India">UX/UI Designer Intern – India</option>
                        <option value="Q/A Intern - India">Q/A – India</option>
                        <option value="HR Intern - India">HR Intern – India</option>
                        <option value="Sales Intern - Bahrain">Sales Intern – Bahrain</option>
                        <option value="Sales Intern - Kuwait">Sales Intern – Kuwait</option>
                        <option value="Sales Intern - Oman">Sales Intern – Oman</option>
                        <option value="Sales Intern - Jordan">Sales Intern – Jordan</option>
                        <option value="Sales Intern - Azerbaijan">Sales Intern – Azerbaijan</option>
                        <option value="Sales Intern - Belarus">Sales Intern – Belarus</option>
                    </select>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                    />

                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                    />

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        required
                        className="text-[#5186cd] font-medium"
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-[#5186cd] hover:bg-[#3f6fb0] text-white font-bold py-3 rounded-xl hover:scale-105 transition"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </form>

                {status === "success" && (
                    <p className="text-[#5186cd] mt-4 text-center font-semibold">
                        ✅ Application submitted successfully!
                    </p>
                )}

                {status === "error" && (
                    <p className="text-red-500 mt-4 text-center font-semibold">
                        ❌ Submission failed. Try again.
                    </p>
                )}
            </motion.div>
        </div>
    );
}
