import { Link } from "react-router-dom";
import trainer_profile from "../assets/trainer_profile.png";

/* -------------------------
   Types (shared or local)
------------------------- */

export interface Profile {
    imageUrl?: string;
    experience?: number;
    education?: string;
    subjects?: string[];
    languages?: string[];
    averageRating?: number;
    about?: string;
}

export interface Trainer {
    _id: string;
    name?: string;
    role?: string;
    profile?: Profile;
}

/* -------------------------
   Props
------------------------- */

interface TrainerBackCardProps {
    trainer: Trainer;
    displayList: string[];
    variant?: "grid" | "modal"; // 👈 important
    className?: string;
}

export default function TrainerBackCard({
    trainer,
    displayList,
    variant = "grid",
    className = "",
}: TrainerBackCardProps) {
    const isModal = variant === "modal";

    return (
        <div
            className={`
        bg-white cursor-pointer text-[#2D274B]
        rounded-[28px]
        shadow-xl
        flex flex-col
        overflow-hidden
        ${isModal ? "w-[660px] max-w-[92vw]" : "h-full"}
      `}
        >
            {/* HEADER */}
            <div className="relative h-[150px] rounded-t-[28px] bg-gradient-to-r from-[#276dc9] to-[#205eb0]">
                <Link
                    to={`/trainer-profile/${trainer._id}`}
                    className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full hover:bg-yellow-300 transition"
                >
                    Free Demo
                </Link>
            </div>

            {/* BODY */}
            <div className="relative px-6 pb-6">
                {/* AVATAR */}
                <div className="">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                        <img
                            src={trainer.profile?.imageUrl || trainer_profile}
                            alt={trainer.name}
                            className="w-14 h-14 object-fill"
                        />
                    </div>
                </div>

                {/* NAME */}
                <h3 className="text-lg font-bold">
                    {trainer.name}
                </h3>

                {/* RATING ROW */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#5186cd]">
                        ⭐ {trainer.profile?.averageRating ?? "4.9"}
                    </span>
                    <span>(342 reviews)</span>
                    <span>• {trainer.profile?.experience ?? 0} years</span>
                </div>

                {/* ABOUT */}
                <div className="mt-3 h-[90px] w-full overflow-y-auto no-scrollbar">
                    <p className="text-xs text-gray-600 leading-relaxed break-words pr-1">
                        {trainer.profile?.about ??
                            "Native speaker with PhD-level expertise, specialized in professional and academic preparation."}
                    </p>
                </div>



                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {displayList.slice(0, 4).map((item) => (
                        <span
                            key={item}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                            {item}
                        </span>
                    ))}
                </div>

                {/* CTA (MODAL ONLY) */}
                {isModal && (
                    <Link
                        to={`/trainer-profile/${trainer._id}`}
                        className="mt-6 block w-full text-center bg-[#276dc9] text-white py-3 rounded-xl font-semibold hover:bg-[#205eb0] transition"
                    >
                        View Profile
                    </Link>
                )}
            </div>
        </div>
    );
}