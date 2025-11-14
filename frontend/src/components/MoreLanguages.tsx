import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Language {
  name: string;
  flag: string;
}

interface Props {
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

const MoreLanguages: React.FC<Props> = ({ selectedLanguage, onSelectLanguage }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [search, setSearch] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<string>("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        // https://api.api-ninjas.com/v1/countryflag?country=US

        const res = await fetch("https://restcountries.com/v3.1/all?fields=flags,languages");
        const data = await res.json();

        const langMap = new Map<string, string>();
        data.forEach((country: any) => {
          if (country.languages && typeof country.languages === "object") {
            Object.values(country.languages).forEach((lang: any) => {
              if (!langMap.has(lang) && country.flags?.png) {
                langMap.set(lang, country.flags.png);
              }
            });
          }
        });

        const langArr = Array.from(langMap, ([name, flag]) => ({ name, flag }));
        setLanguages(langArr);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const filtered = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-20 text-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMore(true)}
        className="px-6 py-3 bg-[#CBE56A] text-[#2D274B] rounded-full shadow-md hover:bg-[#c2e24f] transition"
      >
        {selectedLanguage ? `🌍 ${selectedLanguage}` : "Select Language"}
      </motion.button>
      {/* Modal */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal content */}
            <motion.div
              className="bg-[#2D274B] rounded-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-hidden shadow-2xl text-white relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-600">
                <h2 className="text-2xl font-bold text-[#dc8d33]">
                  🌍 Explore World Languages
                </h2>
                <button
                  onClick={() => setShowMore(false)}
                  className="text-gray-300 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Search bar */}
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#3a3360] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc8d33]"
                />
              </div>

              {/* Scrollable List */}
              <div className="px-5 pb-5 overflow-y-auto max-h-[55vh] grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.length > 0 ? (
                  filtered.map((lang, idx) => (
                    <motion.div
                      key={idx}
                      onClick={() => {
                        onSelectLanguage(lang.name);
                        setShowMore(false);
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.01 }}
                      className="flex items-center gap-3 bg-[#3a3360] rounded-xl px-3 py-2 hover:bg-[#4b437c] transition"
                    >
                      <img
                        src={lang.flag}
                        alt={`${lang.name} flag`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                      />
                      <span className="text-lg font-medium">{lang.name}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center col-span-full">
                    No languages found
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoreLanguages;
