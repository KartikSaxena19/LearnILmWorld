// File: src/pages/register/Steps/StepRole.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import type { RegisterFormData } from "../types";

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  comingFromBack: boolean;
};

const StepRole: React.FC<Props> = ({ formData, setFormData, onNext, comingFromBack }) => {
  // Auto-skip if role already assigned (user redirected into register screen)
  // Auto-skip ONLY when user is first entering register, not when going back
  useEffect(() => {
    if (!comingFromBack && (formData.role === "student" || formData.role === "trainer")) {
      onNext();
    }
  }, [formData.role, comingFromBack]);



  const handleSelect = (role: "student" | "trainer") => {
    setFormData(prev => ({ ...prev, role }));
    onNext();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      {/* Heading */}
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-3xl font-extrabold text-gray-800">
          How do you want to begin your journey?
        </h3>

        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Choose the role that represents you today. This helps us tailor the
          experience specifically for your goals.
        </p>
      </motion.div>

      {/* Options */}
      <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center max-w-xl">
        {/* Student Card */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect("student")}
          className={`w-60 p-7 rounded-2xl border transition-all shadow-sm flex flex-col items-center text-center
            ${
              formData.role === "student"
                ? "border-indigo-500 bg-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:shadow-md"
            }
          `}
        >
          <GraduationCap
            size={36}
            className={`mb-4 ${
              formData.role === "student" ? "text-indigo-500" : "text-gray-500"
            }`}
          />
          <div className="text-lg font-semibold">Student</div>
          <div className="text-sm text-gray-600 mt-1">
            Learn new skills, improve languages, and grow with global trainers.
          </div>
        </motion.button>

        {/* Trainer Card */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect("trainer")}
          className={`w-60 p-7 rounded-2xl border transition-all shadow-sm flex flex-col items-center text-center
            ${
              formData.role === "trainer"
                ? "border-indigo-500 bg-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:shadow-md"
            }
          `}
        >
          <Users
            size={36}
            className={`mb-4 ${
              formData.role === "trainer" ? "text-indigo-500" : "text-gray-500"
            }`}
          />
          <div className="text-lg font-semibold">Trainer</div>
          <div className="text-sm text-gray-600 mt-1">
            Teach learners worldwide and build your professional portfolio.
          </div>
        </motion.button>
      </div>

      {/* Notes */}
      <p className="text-xs text-gray-500 mt-8 text-center opacity-80 max-w-sm leading-relaxed">
        Once you create your account, your role cannot be changed.  
        However, you can update your profile details anytime.
      </p>
    </div>
  );
};

export default StepRole;
