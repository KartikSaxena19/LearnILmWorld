// FILE: src/components/SearchBar.tsx
import React from 'react'
import { Search } from 'lucide-react'


interface Props { value: string; onChange: (v: string) => void }
const SearchBar: React.FC<Props> = React.memo(({ value, onChange }) => {
    return (
        <div className="w-full max-w-4xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D274B] h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search trainers by name, language, or specialization..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9787F3] text-lg"
                />
            </div>
        </div>
    )
})


export default SearchBar