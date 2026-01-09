import React from "react"

type StatPillProps = {
    icon: React.ReactNode
    value: number | string
    label: React.ReactNode
    iconBg: string
}

const StatPill: React.FC<StatPillProps> = ({
    icon,
    value,
    label,
    iconBg,
}) => {
    return (
        <div className="w-[160px] min-h-[260px] bg-white rounded-full px-6 py-8 flex flex-col items-center justify-center shadow-sm">
            <div
                className={`w-12 h-12 mb-5 rounded-full flex items-center justify-center ${iconBg}`}
            >
                {icon}
            </div>

            <p className="text-2xl font-bold text-[#2D274B]">
                {value}
            </p>

            <p className="text-sm text-gray-500 mt-2 text-center font-bold leading-tight">
                {label}
            </p>
        </div>
    )
}

export default StatPill
