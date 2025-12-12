// FILE: src/components/FiltersPanel.tsx
import React, { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import * as Flags from 'country-flag-icons/react/3x2'


const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'jp', name: 'Japanese', flag: '🇯🇵' }
]

const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'RU', name: 'Russia' },
    { code: 'KR', name: 'South Korea' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
    { code: 'TR', name: 'Turkey' },
    { code: 'EG', name: 'Egypt' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'TH', name: 'Thailand' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'PH', name: 'Philippines' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'NZ', name: 'New Zealand' }
]


const SUBJECTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Science', 'Geography', 'History', 'Civics', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies'
]


const HOBBIES = [
    'Dance', 'Singing', 'Guitar', 'Piano', 'Photography', 'Yoga', 'Fitness', 'Cooking', 'Drawing', 'Painting'
]


interface Props { learningType: string; filters: any; setFilters: (f: any) => void; nationalities: string[]; clearFilters: () => void }


const renderFlag = (code?: string) => {
    if (!code) return null;
    const upper = code.toUpperCase();
    const Flag = (Flags as any)[upper];
    if (!Flag) return null;
    return <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm"><Flag title={upper} className="w-full h-full object-cover" /></div>
}


const FiltersPanel: React.FC<Props> = ({ learningType, filters, setFilters, nationalities }) => {
    const uniqueNationalities = nationalities;


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">


            {learningType === 'language' && (
                <div className="relative p-3 rounded-xl shadow-sm bg-[#6b48af]">
                    <label className="text-base font-bold text-white">What's Next?</label>
                    <button onClick={() => setFilters((p: any) => ({ ...p, _toggleLanguageDropdown: !p._toggleLanguageDropdown }))} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center">
                        <span>{filters.language || 'Language'}</span>
                        <ChevronDown className={`h-4 w-4`} />
                    </button>


                    {/* Dropdown local UI (simple: toggling stored on filters._toggleLanguageDropdown) */}
                    {filters._toggleLanguageDropdown && (
                        <div className="absolute bg-[#CBE56A] shadow-xl rounded-xl p-3 mt-2 w-40 z-30 max-h-48 overflow-y-auto">
                            <input type="text" placeholder="Search..." value={filters.language} onChange={(e) => setFilters((p: any) => ({ ...p, language: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm" />
                            {LANGUAGES.filter(l => l.name.toLowerCase().includes((filters.language || '').toLowerCase())).map(lang => (
                                <div key={lang.code} onClick={() => setFilters((p: any) => ({ ...p, language: lang.name, _toggleLanguageDropdown: false }))} className="cursor-pointer flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded text-sm">{lang.flag}<span>{lang.name}</span></div>
                            ))}
                        </div>
                    )}
                </div>
            )}


            {learningType === 'subject' && (
                <div className="relative p-3 rounded-xl shadow-sm bg-[#6b48af]">
                    <label className="text-base font-bold text-white">Area of Mastery</label>
                    <button onClick={() => setFilters((p: any) => ({ ...p, _toggleSubjectDropdown: !p._toggleSubjectDropdown }))} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center">
                        <span>{filters.specialization || 'Subject'}</span>
                        <ChevronDown className={`h-4 w-4`} />
                    </button>


                    {filters._toggleSubjectDropdown && (
                        <div className="absolute bg-[#CBE56A] shadow-xl rounded-xl p-3 mt-2 w-48 z-30 max-h-48 overflow-y-auto text-base">
                            {SUBJECTS.map(subj => (
                                <div key={subj} onClick={() => setFilters((p: any) => ({ ...p, specialization: subj, _toggleSubjectDropdown: false }))} className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">{subj}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {learningType === 'hobby' && (
                <div className="relative p-3 rounded-xl shadow-sm bg-[#6b48af]">
                    <label className="text-base font-bold text-white">Choose a Hobby</label>
                    <button
                        onClick={() => setFilters((p: any) => ({
                            ...p,
                            _toggleHobbyDropdown: !p._toggleHobbyDropdown
                        }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center"
                    >
                        <span>{filters.hobby || 'Hobby'}</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {filters._toggleHobbyDropdown && (
                        <div className="absolute bg-[#CBE56A] shadow-xl rounded-xl p-3 mt-2 w-48 z-30 max-h-48 overflow-y-auto">
                            {HOBBIES.map(h => (
                                <div
                                    key={h}
                                    onClick={() => setFilters((p: any) => ({
                                        ...p,
                                        hobby: h,
                                        _toggleHobbyDropdown: false
                                    }))}
                                    className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}


            {/* Experience */}
            <div className="p-3 rounded-xl shadow-sm bg-[#6b48af] ">
                <label className="text-base font-semibold text-white">Experience (yrs)</label>
                <select value={filters.experience} onChange={e => setFilters((p: any) => ({ ...p, experience: e.target.value }))} className="w-full mt-1 px-2 py-2 border bg-[#CBE56A] rounded-lg text-base font-semibold ">
                    <option value="0">0</option>
                    <option value="2">2</option>
                    <option value="5">5+</option>
                    <option value="10">10+</option>
                </select>
            </div>


            {/* Rating */}
            <div className="p-3 rounded-xl shadow-sm bg-[#6b48af] ">
                <label className="text-base font-semibold text-white">Rating</label>
                <select value={filters.rating} onChange={e => setFilters((p: any) => ({ ...p, rating: e.target.value }))} className="w-full mt-1 px-2 py-2 border bg-[#CBE56A] rounded-lg text-base font-semibold ">
                    <option value="">Any</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.0">4.0+</option>
                    <option value="3.5">3.5+</option>
                </select>
            </div>


            {/* Sort By */}
            <div className="p-3 rounded-xl shadow-sm bg-[#6b48af]">
                <label className="text-base font-bold text-white">Sort By</label>
                <select value={filters.sortBy} onChange={e => setFilters((p: any) => ({ ...p, sortBy: e.target.value }))} className="w-full mt-1 px-2 py-2 border border-gray-300 bg-[#CBE56A] rounded-lg text-sm font-semibold">
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low → High</option>
                    <option value="price_high">Price: High → Low</option>
                    <option value="experience">Most Experienced</option>
                </select>
            </div>


            {/* Min + Max Price */}
            <div className="py-3 px-2 rounded-xl shadow-sm bg-[#6b48af] ">
                <label className="text-base font-bold text-white">Price Range ($/hr)</label>
                <div className="flex items-center gap-2 mt-1 text-[#2D274B]">
                    <input type="number" value={filters.minRate} onChange={e => setFilters((p: any) => ({ ...p, minRate: e.target.value }))} className="w-1/2 px-2 py-2 border border-gray-300 bg-[#CBE56A] rounded-lg text-sm text-[#2D274B] font-semibold" placeholder="Min" />
                    <input type="number" value={filters.maxRate} onChange={e => setFilters((p: any) => ({ ...p, maxRate: e.target.value }))} className="w-1/2 px-2 py-2 border border-gray-300 bg-[#CBE56A] rounded-lg text-sm text-[#2D274B] font-bold" placeholder="Max" />
                </div>
            </div>


            {/* Nationality */}
            <div className="relative p-3 rounded-xl shadow-sm bg-[#6b48af]">
                <label className="text-base font-bold text-white">Nationality</label>
                <button onClick={() => setFilters((p: any) => ({ ...p, _toggleNationality: !p._toggleNationality }))} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        {filters.nationality ? (
                            <>
                                {renderFlag(filters.nationality)}
                                {COUNTRIES.find(c => c.code === filters.nationality)?.name || filters.nationality}
                            </>
                        ) : (
                            'Select Nationality'
                        )}
                    </span>
                    <ChevronDown className={`h-4 w-4 ${filters._toggleNationality ? 'rotate-180' : ''}`} />
                </button>
                {filters._toggleNationality && (
                    <div className="absolute bg-white shadow-xl rounded-xl p-3 mt-2 w-48 z-30 max-h-48 overflow-y-auto">
                        <input
                            type="text"
                            placeholder="Search countries..."
                            value={filters._nationalitySearch || ''}
                            onChange={(e) => setFilters((p: any) => ({ ...p, _nationalitySearch: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm"
                        />
                        {COUNTRIES.filter(country => 
                            country.name.toLowerCase().includes((filters._nationalitySearch || '').toLowerCase())
                        ).map(country => (
                            <div
                                key={country.code}
                                onClick={() => setFilters((p: any) => ({
                                    ...p,
                                    nationality: country.code,
                                    _toggleNationality: false,
                                    _nationalitySearch: ''
                                }))}
                                className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded flex items-center gap-2 text-sm"
                            >
                                {renderFlag(country.code)}
                                <span>{country.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}


export default React.memo(FiltersPanel)