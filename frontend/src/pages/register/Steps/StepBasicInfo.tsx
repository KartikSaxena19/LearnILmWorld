// File: src/pages/register/Steps/StepBasicInfo.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactFlagsSelect from "react-flags-select";
import type { RegisterFormData } from "../types";
import FormLabel from "../../../components/FormLabel";

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  onBack: () => void;
};

const StepBasicInfo: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ email?: string; country?: string }>(
    {}
  );

  const country = formData.location?.split("|")[0] || "";
  const city = formData.location?.split("|")[1] || "";

  // Validations
  const validate = () => {
    let temp: any = {};

    if (!formData.email.trim()) temp.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      temp.email = "Invalid email format";

    if (!country) temp.country = "Please select your country";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Tell us about yourself
        </motion.h3>

        <p className="text-sm text-gray-500 mb-6">
          This helps us personalize your experience.
        </p>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <FormLabel required>Email address</FormLabel>

            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label> */}
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full p-3 border rounded-xl outline-none transition ${
                errors.email ? "border-red-500" : "focus:ring-2 focus:ring-indigo-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Country Select with Flags */}
          <div>
            <FormLabel required>Country</FormLabel>
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label> */}

            <ReactFlagsSelect
              selected={formData.nationalityCode || ""}
              searchable={true}
              searchPlaceholder="Search country..."
              onSelect={(code) => {
                let countryName =
                  new Intl.DisplayNames(["en"], { type: "region" }).of(code) ||
                  "";

                setFormData((prev) => ({
                  ...prev,
                  nationalityCode: code,
                  location: `${countryName}|${city}`,
                }));
              }}
              placeholder="Select country"
              className={`w-full ${
                errors.country ? "border-red-500" : ""
              }`}
            />

            {errors.country && (
              <p className="text-xs text-red-500 mt-1">{errors.country}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City / Area (optional)
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: `${country}|${e.target.value}`,
                }))
              }
              placeholder="City, area or pin code"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none transition"
            />

            <p className="text-xs text-gray-400 mt-1">
              Adding your city helps us show trainers near your region.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepBasicInfo;
