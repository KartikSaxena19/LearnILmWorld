// FILE: src/components/LearningTypeSelector.tsx
import React from 'react'


interface Props { learningType: string; onChange: (t: 'language' | 'subject' | 'hobby') => void }
const LearningTypeSelector: React.FC<Props> = React.memo(({ learningType, onChange }) => {
    return (
        <>
            <button onClick={() => onChange('language')} className={`px-4 py-2 rounded-lg text-lg font-bold ${learningType === 'language' ? 'bg-[#CBE56A] text-[#2D274B]' : 'bg-gray-200 text-gray-700'}`}>Learn a Language</button>
            <button onClick={() => onChange('subject')} className={`px-4 py-2 rounded-lg text-lg font-bold ${learningType === 'subject' ? 'bg-[#CBE56A] text-[#2D274B]' : 'bg-gray-200 text-gray-700'}`}>Learn a Subject</button>
            <button onClick={() => onChange('hobby')} className={`px-4 py-2 rounded-lg text-lg font-bold ${learningType === 'hobby' ? 'bg-[#CBE56A] text-[#2D274B]' : 'bg-gray-200 text-gray-700'}`}>Learn a Hobby</button>
        </>
    )
})


export default LearningTypeSelector