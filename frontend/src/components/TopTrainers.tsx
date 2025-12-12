import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import trainer_profile from "../assets/trainer_profile.png";
import spanish from "../assets/Spanish_Trainer.png";
import german from "../assets/German_Trainer.jpeg";
import english from "../assets/English_Trainer.png";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* -------------------------
   Types
   ------------------------- */
interface Profile {
  imageUrl?: string;
  experience?: number;
  education?: string;
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

  useEffect(() => {
    const top = [
    
      //  LANGUAGE TRAINERS 
      // -------------------------

      {
        _id: "68ef33d0cad95b62472f382a",
        name: "Shannet",
        role: "trainer",
        profile: {
          imageUrl: spanish,
          languages: ["Spanish"],
          subjects: [],
          experience: 14,
          education: "Master's in Human and Social Sciences ",
        },
        pickRole: "language",
      },

      {
        _id: "691c5f3ca0cce9bf08c670da",
        name: "Sinqobile Mazibuko",
        role: "trainer",
        profile: {
          imageUrl: english,
          languages: ["English"],
          subjects: [],
          experience: 5,
          education: "Certified Online English Trainer",
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
          education: "Bachelor's in German Language",
        },
        pickRole: "language",
      },

      
      // SUBJECT TRAINERS
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
          education: "Master's in Technology",
        },
        pickRole: "subject",
      },

      // {
      //   _id: "68ecb5fe64bc73d89ba43040",
      //   name: "Trainer 3",
      //   role: "trainer",
      //   profile: {
      //     imageUrl: "",
      //     subjects: ["Geography", "Political Science"],
      //     languages: [],
      //     experience: 7,
      //   },
      //   pickRole: "subject",
      // },
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
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 px-2 mt-12">
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
                  min-w-[290px] max-w-[290px] 
                  lg:min-w-[275px] lg:max-w-[275px]
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
                    <p className="text-center text-base text-[#CBE56A] font-medium mt-1">
                      {displayList.slice(0, 3).join(", ")}
                    </p>
                  ) : (
                    <p className="text-center text-sm text-[#CBE56A] font-medium mt-1">
                      Experienced tutor
                    </p>
                  )}

                  <div className="mt-4 text-base text-center">
                    <span className="text-[#CBE56A] font-semibold">
                      {trainer.profile?.experience ?? 0} yrs+
                    </span>{" "}
                    experience
                  </div>
                  {/*  Education */}
                  {trainer.profile?.education && (
                    <p className="mt-2 text-center text-sm text-[#ECFDF5] leading-snug">
                      🎓 {trainer.profile.education}
                    </p>
                  )}
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

        {/* More Trainers */}
        <div className="flex justify-center mt-10">
          <Link
            to="/main"
            className="
              px-8 py-3 
              bg-[#CBE56A] 
              text-[#2D274B] 
              font-semibold 
              rounded-xl 
              shadow-md 
              hover:bg-[#d6f05c] 
              transition 
              text-lg
            "
          >
            More Trainers
          </Link>
        </div>

      </div>
    </section>
  );
}
