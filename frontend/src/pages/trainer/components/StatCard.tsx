import React from 'react'

/* ---------------- StatCard Component ---------------- */
type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
};
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="rounded-xl p-3 text-center bg-white shadow-md border border-gray-100 hover:scale-105 transition-all duration-300">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div className="text-2xl font-bold text-[#2D274B] mb-1">{value}</div>
    <div className="text-sm font-semibold" style={{ color }}>{label}</div>
  </div>
)

export default StatCard