import React from 'react'

/* Lightweight UI building blocks used by the requested Home screen */

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; btnText: React.ReactNode; btnColor?: string }> = ({ icon, title, desc, btnText, btnColor = 'bg-emerald-500 hover:bg-emerald-600' }) => (
  <div className="p-6 rounded-2xl bg-white/90 border border-white/20 shadow-sm flex flex-col justify-between">
    {/*icon title desc  */}
    <div>
      <div className="mb-4">{icon}</div>

      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      <p className="text-slate-600 mt-2">{desc}</p>
    </div>
    {/* button */}
    <div className="mt-6">
      <button className={`px-4 py-2 rounded-lg font-semibold transition ${btnColor}`}>{btnText}</button>
    </div>
  </div>
)

export default FeatureCard;