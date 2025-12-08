import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import trainer_profile from "../assets/trainer_profile.png";
import spanish from "../assets/Spanish_Trainer.png";
import german from "../assets/German_Trainer.jpeg";
import english from "../assets/English_Trainer.png";
// import Marquee from "./Marquee";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* -------------------------
   Types
   ------------------------- */
interface Profile {
  imageUrl?: string;
  experience?: number;
  subjects?: string[];
  languages?: string[];
  averageRating?: number;
}

interface Trainer {
  _id: string;
  name?: string;
  role?: string;
  profile?: Profile;
}

/* small helper for rendering label */
type PickRole = "language" | "subject" | "other";

export default function TopTrainers(): JSX.Element {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  // keep mapping of trainerId -> pick role for rendering
  const [pickRoleMap, setPickRoleMap] = useState<Record<string, PickRole>>({});

//   useEffect(() => {
//     const fetchTopTrainers = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/users/trainers`);
//         let data: Trainer[] = Array.isArray(res.data) ? res.data : [];

//         // Keep only trainers
//         data = data.filter((t) => t && t.role === "trainer");

//         // Sort by rating (fallback to experience) desc for "top" ordering
//         data = data.sort((a, b) => {
//           const ar = a?.profile?.averageRating ?? 0;
//           const br = b?.profile?.averageRating ?? 0;
//           if (br !== ar) return br - ar;
//           const ae = a?.profile?.experience ?? 0;
//           const be = b?.profile?.experience ?? 0;
//           return be - ae;
//         });

//         // selection algorithm:
// const selectedIds = new Set<string>();
// const selected: Trainer[] = [];
// const roleMap: Record<string, PickRole> = {};

// // 1) pick up to 3 language trainers
// for (const t of data) {
//   if (selected.filter(s => roleMap[s._id] === "language").length >= 3) break;
//   const id = t._id;
//   if (!id || selectedIds.has(id)) continue;
//   if (t.profile?.languages?.length) {
//     selected.push(t);
//     selectedIds.add(id);
//     roleMap[id] = "language";
//   }
// }

// // 2) pick up to 2 subject trainers (ONLY if they have subjects)
// for (const t of data) {
//   if (selected.filter(s => roleMap[s._id] === "subject").length >= 2) break;
//   const id = t._id;
//   if (!id || selectedIds.has(id)) continue;
//   if (t.profile?.subjects?.length) {
//     selected.push(t);
//     selectedIds.add(id);
//     roleMap[id] = "subject";
//   }
// }

// // 3) Fill remaining slots ONLY with trainers who have languages or subjects
// for (const t of data) {
//   if (selected.length >= 5) break;
//   const id = t._id;
//   if (!id || selectedIds.has(id)) continue;

//   const hasLang = t.profile?.languages?.length;
//   const hasSub = t.profile?.subjects?.length;

//   if (!hasLang && !hasSub) continue; // skip meaningless trainers entirely

//   selected.push(t);
//   selectedIds.add(id);

//   // assign proper role for display
//   if (hasLang) roleMap[id] = "language";
//   else if (hasSub) roleMap[id] = "subject";
// }


//         // Ensure final length is at most 5
//         const finalList = selected.slice(0, 5);

//         setTrainers(finalList);
//         setPickRoleMap(roleMap);
//       } catch (err) {
//         console.error("Error fetching trainers:", err);
//       }
//     };

//     fetchTopTrainers();
//   }, []);

  useEffect(() => {
    const top = [
      // -------------------------
      // 1) LANGUAGE TRAINERS (first 3)
      // -------------------------

      {
        _id: "68ef33d0cad95b62472f382a",
        name: "Shannet",
        role: "trainer",
        profile: {
          imageUrl: spanish,
          languages: ["Spanish"],
          subjects: [],
          experience: 8,
        },
        pickRole: "language",
      },

      {
        _id: "691c5f3ca0cce9bf08c670da",
        name: "SINQOBILE MAZIBUKO",
        role: "trainer",
        profile: {
          imageUrl: english,
          languages: ["English"],
          subjects: [],
          experience: 5,
        },
        pickRole: "language",
      },

      {
        _id: "691c58dba0cce9bf08c670c0",
        name: "Esraa Mohamed",
        role: "trainer",
        profile: {
          imageUrl: german,
          languages: ["German"],
          subjects: [],
          experience: 10,
        },
        pickRole: "language",
      },

      // -------------------------
      // 2) SUBJECT TRAINERS (last 2)
      // -------------------------

      {
        _id: "690dc8cb64cc3e1c19580f24",
        name: "Alfa",
        role: "trainer",
        profile: {
          imageUrl: "",
          subjects: ["Economics", "History", "Science", "Social Studies"],
          languages: [],
          experience: 8,
        },
        pickRole: "subject",
      },

      {
        _id: "68ecb5fe64bc73d89ba43040",
        name: "Trainer 3",
        role: "trainer",
        profile: {
          imageUrl: "",
          subjects: ["Geography", "Political Science"],
          languages: [],
          experience: 7,
        },
        pickRole: "subject",
      },
    ];

    setTrainers(top);

    // role map for badge + correct display
    const map: Record<string, "language" | "subject"> = {};
    top.forEach((t) => {
      map[t._id] = t.pickRole as "language" | "subject";
    });

    setPickRoleMap(map);
  }, []);

  return (
    // bg-[#6b48af]
    <section className="py-24 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif font-extrabold text-[#E0FA84] text-center"
        >
          Meet Our Top Trainers
        </motion.h2>

        <p className="text-center text-xl text-[#2D274B] mt-3 font-medium">
          Highly rated & verified mentors — languages & subjects.
        </p>

       {/* Trainer Cards Row */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 px-2 mt-12">
          {trainers.map((trainer, idx) => {
            const id = trainer._id;
            const role = id ? pickRoleMap[id] ?? "other" : "other";
            const showLangs =
              role === "language" && trainer.profile?.languages?.length;
            const showSubs =
              role === "subject" && trainer.profile?.subjects?.length;

            const displayList =
              showLangs
                ? trainer.profile!.languages!
                : showSubs
                ? trainer.profile!.subjects!
                : trainer.profile?.languages?.length
                ? trainer.profile.languages
                : trainer.profile?.subjects || [];

            return (
              <div
                key={id ?? idx}
                className="
                  min-w-[260px] max-w-[260px]
                  lg:min-w-[220px] lg:max-w-[220px]
                  bg-[#2D274B] text-white rounded-2xl shadow-xl p-6
                  hover:scale-105 transition cursor-pointer
                  flex flex-col
                "
              >
                <div className="flex-grow">
                  <div className="flex justify-end mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        role === "language"
                          ? "bg-[#704CB2] text-white"
                          : role === "subject"
                          ? "bg-[#CBE56A] text-[#2D274B]"
                          : "bg-white text-[#2D274B]"
                      }`}
                    >
                      {role === "language"
                        ? "Language"
                        : role === "subject"
                        ? "Subject"
                        : "Trainer"}
                    </span>
                  </div>

                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#CBE56A] shadow">
                    <img
                      src={trainer.profile?.imageUrl || trainer_profile}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-center mt-4">{trainer.name}</h3>

                  {displayList.length > 0 ? (
                    <p className="text-center text-sm text-[#CBE56A] font-medium mt-1">
                      {displayList.slice(0, 3).join(", ")}
                    </p>
                  ) : (
                    <p className="text-center text-sm text-[#CBE56A] font-medium mt-1">
                      Experienced tutor
                    </p>
                  )}

                  <div className="mt-4 text-sm text-center">
                    <span className="text-[#CBE56A] font-semibold">
                      {trainer.profile?.experience ?? 0} yrs
                    </span>{" "}
                    experience
                  </div>
                </div>

                {/* FIXED BOTTOM BUTTON */}
                <Link
                  to={`/trainer-profile/${trainer._id}`}
                  className="mt-5 w-full text-center bg-[#CBE56A] text-[#2D274B] py-2 rounded-lg font-semibold hover:bg-[#d6f05c] transition"
                >
                  View Profile
                </Link>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
