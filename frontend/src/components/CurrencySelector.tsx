import { useState, useMemo } from 'react'
import { useCurrency } from '../contexts/CurrencyContext'
import { ChevronDown } from 'lucide-react'

type Props = {
    variant?: 'default' | 'header'
    onSelect?: () => void
}

const CurrencySelector = ({ variant = 'default', onSelect }: Props) => {
    const isHeader = variant === 'header'
    const { currency, setCurrency, currencies } = useCurrency()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')

    // console.log('Currencies:', currencies.length)

    const filtered = useMemo(() => {
        return currencies.filter(c =>
            c.code.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase())
        )
    }, [query, currencies])

    return (
        <div className={`relative w-64 ${isHeader ? 'text-white bg-[#5186cd] w-[200px] rounded-md' : ''}`}>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex justify-between items-center px-3 py-2 border rounded-lg transition
                ${isHeader
                        ? 'bg-[#5186cd] border-white/40 text-white hover:bg-white/10'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
            >

                <span>{currency}</span>
                <ChevronDown className="h-4 w-4" />
            </button>

            {open && (
                <div className={`absolute z-50 mt-2 w-full border rounded-lg shadow-lg ${isHeader ? 'bg-white text-gray-900' : 'bg-white'}`}
                >
                    <input
                        placeholder="Search currency..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className={`w-full px-3 py-2 border-b outline-none ${isHeader
                            ? 'bg-white text-gray-900 placeholder-gray-500'
                            : 'bg-white text-gray-900'
                            }`}
                    />

                    <div className="max-h-64 overflow-y-auto">
                        {filtered.map((c: any) => (
                            <div
                                key={c.code}
                                onClick={() => {
                                    setCurrency(c.code)
                                    setOpen(false)
                                    setQuery('')
                                    onSelect?.()
                                }}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                            >
                                <span className="font-medium">{c.code}</span>
                                <span className="text-gray-500 ml-2">{c.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CurrencySelector
