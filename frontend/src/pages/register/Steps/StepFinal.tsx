// File: src/pages/register/Steps/StepFinal.tsx
import React, { useState } from 'react'
import type { RegisterFormData } from '../types'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import FormLabel from "../../../components/FormLabel"

type Props = {
  formData: RegisterFormData
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>
  onBack: () => void
  onSubmit: () => void
  loading: boolean
}

const StepFinal: React.FC<Props> = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
  loading
}) => {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-5">Almost done — Account Details</h3>

        <div className="space-y-5">

          {/* Full Name */}
          <div>
            <FormLabel required>Full Name</FormLabel>
            <input
              type="text"
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border rounded-lg bg-white"
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <FormLabel required>Phone Number</FormLabel>
            <PhoneInput
              country={'in'}
              value={formData.phone}
              onChange={(phone, country) =>
                setFormData(prev => ({
                  ...prev,
                  phone,
                  nationalityCode: (country as any)?.iso2?.toUpperCase()
                }))
              }
              inputStyle={{
                width: '100%',
                height: '48px',
                borderRadius: '8px'
              }}
              buttonStyle={{
                borderRadius: '8px 0 0 8px'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <FormLabel required>Password</FormLabel>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                className="w-full p-3 border rounded-lg pr-12 bg-white"
                placeholder="Create a password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <FormLabel required>Confirm Password</FormLabel>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))
                }
                className="w-full p-3 border rounded-lg pr-12 bg-white"
                placeholder="Re-enter your password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border bg-white"
        >
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-400 text-black font-semibold disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

export default StepFinal
