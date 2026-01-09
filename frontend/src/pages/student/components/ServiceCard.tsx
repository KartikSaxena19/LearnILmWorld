import React from "react";

/* Lightweight UI building blocks used by the requested Home screen */

/* ---------------- ServiceCard ---------------- */
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  bg?: string;
  title: string;
  desc: string;
  color: string;
}> = ({
  icon,
  bg = 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  title,
  desc,
}) => (
    <div className="p-6 rounded-2xl bg-white/90 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Icon Section */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
        {icon}
      </div>

      {/* Title - dark and clear */}
      <h4 className="font-semibold text-xl text-[#2D274B]">
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
        {desc}
      </p>
    </div>
  )

export default ServiceCard