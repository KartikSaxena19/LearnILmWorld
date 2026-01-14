import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LanguageCardProps = {
    data: {
        lang: string;
        bg: string;
        hoverBg: string;
        flag: string;
        pattern?: string;
        headline: string;
        subtitle?: string;
        levels: string[];
        idealFor: string;
    };
    onConfirm: (language: string) => void;
};


export function LanguageCard({ data, onConfirm }: LanguageCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    return (
        <>
            <div className='flex justify-center'>
                {/* GRID CARD*/}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(true)}
                    className="group relative h-[200px] w-[230px] rounded-[24px] overflow-hidden cursor-pointer bg-white shadow-[0_20px_30px_5px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out hover:-translate-y-4 hover:shadow-[0_40px_50px_10px_rgba(0,0,0,0.4)]"
                >
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${data.bg})` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/10 transition-all duration-300 group-hover:bg-black/0" />

                    {/* Language label */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-white/90 text-[#2D274B] font-bold text-lg shadow">
                        {data.lang}
                    </div>
                </motion.div>

                {/* CENTER PREVIEW CARD */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={close}
                        >
                            <motion.div
                                className="relative w-[900px] max-w-[95%] h-[520px] rounded-3xl overflow-hidden shadow-2xl"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${data.hoverBg})` }}
                                />
                                <div className="absolute inset-0 bg-black/15" />

                                {/* Middle content */}
                                <div className="relative z-10 h-full p-10 flex flex-col justify-between text-left text-white">

                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://flagcdn.com/w40/${data.flag}.png`}
                                                alt={`${data.lang} flag`}
                                                className=" w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-md "
                                            />

                                            <h2 className="text-4xl font-extrabold">
                                                {data.lang} Language
                                            </h2>
                                        </div>

                                        {/* {data.pattern && (
                                            <span className="px-4 py-1.5 rounded-full bg-[#9787F3] text-white text-sm font-semibold">
                                                {data.pattern}
                                            </span>
                                        )} */}
                                    </div>

                                    {/* Middle content */}
                                    <div className="mt-12 max-w-xl">
                                        {/* Headline */}
                                        <h3 className="text-2xl font-bold text-[#FFD86B]  ">
                                            {data.headline}
                                        </h3>

                                        {/* Optional subtitle */}
                                        {data.subtitle && (
                                            <p className="text-lg text-white/90 mb-1 font-medium">
                                                {data.subtitle}
                                            </p>
                                        )}

                                        {/* Levels */}
                                        <ul className="space-y-1 text-xl font-medium">
                                            {data.levels.map((lvl, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="text-[#FFD86B]">•</span>
                                                    <span>{lvl}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Ideal for */}
                                        <p className="mt-1 text-lg text-white/95 font-medium">
                                            {data.idealFor}
                                        </p>
                                    </div>


                                    {/* CTA */}
                                    <button
                                        onClick={() => {
                                            close();
                                            onConfirm(data.lang);
                                        }}
                                        className="mt-0.5 w-fit px-6 py-3 rounded-full bg-[#FFD86B] text-[#2D274B] font-bold text-lg hover:scale-105 transition"
                                    >
                                        Click to start learning →
                                    </button>

                                    {/* Close */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            close();
                                        }}
                                        className="absolute top-6 right-6 text-white text-2xl hover:scale-110 transition"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
