// File: src/pages/register/Steps/StepTrainerDetails.tsx
import React from 'react'
import type { RegisterFormData } from '../types'
import FormLabel from "../../../components/FormLabel"

type Props = {
  formData: RegisterFormData
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>
  onNext: () => void
  onBack: () => void
}

const StepTrainerDetails: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack
}) => {

  // Validation before moving to the next step
  const handleNext = () => {
    if (
      !formData.education.trim() ||
      !formData.experience.toString().trim() ||
      !formData.bio.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    onNext();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold mb-3">Trainer Details</h3>

        <div className="space-y-4">

          {/* Highest Qualification */}
          <div>
            <FormLabel required>Highest Qualification</FormLabel>
            <input
              type="text"
              value={formData.education}
              onChange={e =>
                setFormData(prev => ({ ...prev, education: e.target.value }))
              }
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., BSc in Mathematics"
            />
          </div>

          {/* Experience */}
          <div>
            <FormLabel required>Experience (years)</FormLabel>
            <input
              type="number"
              min={0}
              value={formData.experience}
              onChange={e =>
                setFormData(prev => ({ ...prev, experience: e.target.value }))
              }
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., 3"
            />
          </div>

          {/* Bio */}
          <div>
            <FormLabel required>Bio</FormLabel>
            <textarea
              value={formData.bio}
              onChange={e =>
                setFormData(prev => ({ ...prev, bio: e.target.value }))
              }
              className="w-full p-3 border rounded-lg h-32 resize-none"
              placeholder="Write something about yourself..."
            />
          </div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default StepTrainerDetails
