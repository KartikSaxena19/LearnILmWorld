// FILE: src/components/LearningTypeSelector.tsx
import React from 'react'


interface Props { learningType: string; onChange: (t: 'language' | 'subject' | 'hobby') => void }

const LearningTypeSelector: React.FC<Props> = React.memo(({ learningType, onChange }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">

            {/* Language */}
            <button
                onClick={() => onChange('language')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2
          px-4 sm:px-6 py-2
          text-sm sm:text-lg font-bold
          rounded-full border-2 border-black
          transition-all duration-200
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          ${learningType === 'language'
                        ? 'bg-[#E0B0FF] text-[#2D274B]'
                        : 'bg-gray-200 text-gray-700'
                    }`}
            >
                <span className="text-base sm:text-xl">文<sub>A</sub></span>
                <span>Learn a Language</span>
            </button>

            {/* Subject */}
            <button
                onClick={() => onChange('subject')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2
          px-4 sm:px-6 py-2
          text-sm sm:text-lg font-bold
          rounded-full border-2 border-black
          transition-all
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          ${learningType === 'subject'
                        ? 'bg-[#E0B0FF] text-[#2D274B]'
                        : 'bg-gray-200 text-gray-700'
                    }`}
            >
                <span className="text-base sm:text-xl">📝</span>
                <span>Learn a Subject</span>
            </button>

            {/* Hobby */}
            <button
                onClick={() => onChange('hobby')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2
          px-4 sm:px-6 py-2
          text-sm sm:text-lg font-bold
          rounded-full border-2 border-black
          transition-all
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          ${learningType === 'hobby'
                        ? 'bg-[#E0B0FF] text-[#2D274B]'
                        : 'bg-gray-200 text-gray-700'
                    }`}
            >
                <span className="text-base sm:text-xl">🎨</span>
                <span>Learn a Hobby</span>
            </button>

        </div>
    )
})



export default LearningTypeSelector