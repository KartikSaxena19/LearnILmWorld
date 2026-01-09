import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import trainer_profile from "../assets/trainer_profile.png";
import spanish from "../assets/Spanish_Trainer.png";
import german from "../assets/German_Trainer.jpeg";
import english from "../assets/English_Trainer.png";

import TrainerBackCard, { Trainer } from "../components/TrainerBackCard";


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Moved types in TrainerBackCard.tsx component

/* small helper for rendering label */
type PickRole = "language" | "subject" | "other";

export default function TopTrainers(): JSX.Element {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  // keep mapping of trainerId -> pick role for rendering
  const [pickRoleMap, setPickRoleMap] = useState<Record<string, PickRole>>({});

  const [activeTrainer, setActiveTrainer] = useState<Trainer | null>(null);

  //Card flipping control
  const [hoveredTrainerId, setHoveredTrainerId] = useState<string | null>(null);


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
          about: "Shanat Andrea Oliveros Avendaño is a language specialist with over 14 years of teaching experience and one year of professional translation , proficient in English, French, and Spanish , with a teaching approach based on international curricula and methodologies like CLIL, IB, and Cambridge , and has successfully supported students of all ages. She holds a Master's in Human and Social Sciences - General and Comparative Literature from the University of Sorbonne Nouvelle (2020-2022) and a Bachelor's in Foreign Language Teaching from UPTC (2005-2011). She has extensive experience as a virtual Spanish instructor at multiple institutions"
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
          about: "Sinqobile Mazibuko is a dedicated and certified Online Teacher with five years of experience, specializing in English, IsiZulu, Mathematics, Science, and Technology, who is familiar with the Caps and IEB curriculum and teaches across the foundation, intermediate, and senior phases, offering services like home schooling, extra lessons, exam preparation, and adult ESL."
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
          about: "Esraa Mohamed is a motivated and energetic German Instructor with a background in designing meaningful lessons, providing positive mentoring, and enhancing student performance, and has experience in various educational institutions since 2014, and holds a Bachelor's degree in German Language from Ain Shams University, along with certifications like Goethe-Institute's B2 and several DLL (Deutsch Lehren Lernen) courses"
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
    // bg-[#6b48af] E0FA84
    <section className="py-24 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif font-extrabold text-[#F64EBB] text-center"
        >
          Meet Our Top Trainers
        </motion.h2>

        <p className="text-center text-xl text-[#2D274B] mt-3 font-medium">
          Highly rated & verified mentors — languages & subjects.
        </p>

        {/* Trainer Cards Row */}
        <div className="group flex flex-wrap lg:flex-nowrap justify-center gap-8 px-2 mt-12">
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
                className="group [perspective:1000px]"
                onMouseEnter={() => setHoveredTrainerId(id)}
                onMouseLeave={() => setHoveredTrainerId(null)}
                onClick={() => {
                  setActiveTrainer(trainer);
                }}
              >
                <div
                  className={`
                    relative h-[320px] w-[270px]
                    transition-transform duration-700
                    [transform-style:preserve-3d]
                    ${hoveredTrainerId === id ? "[transform:rotateY(180deg)]" : ""}
  `}
                >

                  <div
                    className="  
                    absolute inset-0
                    bg-[#6B48AF] text-white rounded-[32px] shadow-xl p-4
                    hover:scale-105 transition cursor-pointer
                    flex flex-col
                    [backface-visibility:hidden]
                      "
                  >
                    <div className="flex-grow">
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="w-24 h-24 ml-3 rounded-full overflow-hidden border-3 border-[#2D274B] shrink-0">
                          <img
                            src={trainer.profile?.imageUrl || trainer_profile}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="w-[150px] text-right">
                          <span
                            className={`text-[12px] px-2 py-1 rounded-full font-semibold inline-block mb-1 ${role === "language"
                              ? "bg-[#4430a9] text-white"
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

                          <p className="text-base font-bold text-[#CBE56A] leading-tight mt-2">
                            {displayList.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-center mt-2">
                        {trainer.name}
                      </h3>

                      <div className="flex-1 flex flex-col justify-center text-center mt-2">
                        <p className="text-base">
                          <span className="text-[#CBE56A] font-semibold">
                            {trainer.profile?.experience ?? 0} yrs+
                          </span>{" "}
                          experience
                        </p>

                        {trainer.profile?.education && (
                          <p className="text-[16px] text-[#ECFDF5] mt-1 leading-snug">
                            🎓 {trainer.profile.education}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/trainer-profile/${trainer._id}`}
                      className="mt-3 w-full text-center bg-[#F64EBB] text-[#white] py-2 rounded-lg font-semibold hover:bg-[#f123a9] transition"
                    >
                      View Profile
                    </Link>
                  </div>


                  {/* BACK FACE (inside flip) */}
                  <div
                    className=" absolute inset-0 [transform:rotateY(180deg)]  [backface-visibility:hidden]"
                  >
                    <TrainerBackCard
                      trainer={trainer}
                      displayList={displayList}
                      className="h-full"
                    />
                  </div>

                </div>
              </div>

            );
          })}
        </div>

        {/* More Trainers bg-[#CBE56A] text-[#2D274B]*/}
        <div className="flex justify-center mt-10">
          <Link
            to="/main"
            className="
              px-8 py-3 
              bg-[#F64EBB] 
              text-[white] 
              font-semibold 
              rounded-xl 
              shadow-md 
              hover:bg-[#f61fab] 
              transition 
              text-lg
            "
          >
            More Trainers
          </Link>
        </div>

      </div>

      {/* Overlay wrapper */}
      {activeTrainer && (
        <div
          className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => {
            setActiveTrainer(null);
            // setIsFlipped(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <TrainerBackCard
                trainer={activeTrainer}
                displayList={
                  activeTrainer.profile?.languages?.length
                    ? activeTrainer.profile.languages
                    : activeTrainer.profile?.subjects ?? []
                }
                variant="modal"
              />
            </motion.div>
          </div>
        </div>
      )}


    </section>
  );
}
