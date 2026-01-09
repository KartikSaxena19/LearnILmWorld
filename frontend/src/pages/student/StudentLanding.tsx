// src/pages/student
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ServiceCard from "./components/ServiceCard";
import FeatureCard from "./components/FeatureCard";
import { BookOpen, Users, MessageCircle, Star, TrendingUp } from "lucide-react";

/* ---------- Types ---------- */
type AnyObj = Record<string, any>


/* ---------------- StudentLanding Home ---------------- */
const StudentLanding: React.FC = () => {
  const { user } = useAuth() as AnyObj

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-8">

      {/* Welcome Section (Shiny Gradient like Dashboard) */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#F6EDFF] to-[#FFF7ED] shadow-md text-white">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#E9D8FD] rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#6B21A8]" />
          </div>
          <h1 className="text-3xl font-bold text-[#6B21A8] drop-shadow-md">
            Keep Growing, {user?.name || "Learner"}! 🚀
          </h1>
        </div>
        <p className="text-gray-800/90 font-medium">
          Every step you take brings you closer to mastering your goals with LearniLM🌎World..
        </p>
      </div>

      {/* Explore Services */}
      <div>
        <h2 className="text-2xl font-bold text-[#2D274B] mb-6">
          Explore Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <ServiceCard
            icon={<BookOpen className="w-6 h-6 text-[#6B21A8]" />}
            bg="bg-gradient-to-br from-[#E9D8FD] to-[#DDD6FE]"
            title="Subject Mastery"
            desc="Conceptual understanding to build a strong foundation"
            color="text-[#6B21A8]"
          />

          <ServiceCard
            icon={<Users className="w-6 h-6 text-[#1E3A8A]" />}
            bg="bg-gradient-to-br from-[#DBEAFE] to-[#E0E7FF]"
            title="Professional Trainers"
            desc="Get expert guidance for your learning journey"
            color="text-[#1E3A8A]"
          />

          <ServiceCard
            icon={<MessageCircle className="w-6 h-6 text-[#6B21A8]" />}
            bg="bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF]"
            title="Improve Communication"
            desc="Practice and refine your communication skills"
            color="text-[#6B21A8]"
          />

          <ServiceCard
            icon={<Star className="w-6 h-6 text-[#92400E]" />}
            bg="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]"
            title="Language Development"
            desc="Build confidence and fluency step by step"
            color="text-[#92400E]"
          />

        </div>
      </div>


      {/* Bottom Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <FeatureCard
          icon={<Users className="w-6 h-6 text-[#6B21A8]" />}
          title="Find Your Perfect Trainer"
          desc="Browse through our network of expert trainers and counselors to find the perfect match for your learning goals."
          btnText={<Link to="/main" className="block">Browse All Trainers</Link>}
          btnColor="
      bg-gradient-to-r from-[#E9D8FD] to-[#DDD6FE]
      hover:from-[#DDD6FE] hover:to-[#C4B5FD]
      text-[#6B21A8]
    "
        />

        <FeatureCard
          icon={<MessageCircle className="w-6 h-6 text-[#6B21A8]" />}
          title="Your Learning Journey"
          desc="Keep track of your sessions, view feedback from trainers, and monitor your progress."
          btnText={<Link to="/student/sessions" className="block">View My Sessions</Link>}
          btnColor="
      bg-gradient-to-r from-[#F3E8FF] to-[#E9D5FF]
      hover:from-[#E9D5FF] hover:to-[#D8B4FE]
      text-[#6B21A8]
    "
        />

      </div>

    </div>
  )
}

export default StudentLanding;
