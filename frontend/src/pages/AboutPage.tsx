import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  HelpCircle, FileText, BookOpen, Briefcase, HandHeart, ShieldCheck, Lightbulb, Users, CreditCard, RefreshCcw, UserX, XCircle, CalendarX, LifeBuoy, Mail, UserCheck, Scale, Shield, Gavel,
} from "lucide-react"
// Facebook, Twitter, Instagram, Linkedin, removed ffrom above
import bg_head from "../assets/header_bg.jpg";
import bg_img from '../assets/bg_main.jpeg'
import about_us from '../assets/About_us1.png';
import our_story from '../assets/our_story.png';
import careers_img from '../assets/careers_img.png';
import { Nav, Container, Offcanvas, Button } from "react-bootstrap"
//  Navbar,  removed from above react-bootstrap
import Footer from "../components/Footer";
import CareerApplicationForm from "../components/CareerApplicationForm"
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AboutPage() {
  const location = useLocation()
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

  const [feedbackStatus, setFeedbackStatus] = useState<String | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showCareerForm, setShowCareerForm] = useState(false)



  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [location])

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send feedback');
      }

      setFeedbackStatus('success');
      setFeedbackData({ name: '', email: '', category: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setFeedbackStatus('error');
    }
  };


  return (
    <div className="min-h-screen font-inter bg-fixed text-black scroll-smooth"
      style={{
        backgroundImage:
          `url(${bg_img})`,
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}>

      {/* HEADER */}
      {/* <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-3 pb-1">
          <div className="flex items-center justify-between rounded-full backdrop-blur-md shadow-xl px-6 py-3"
            style={{
              backgroundImage:
                `url(${bg_head})`,
              position: "relative",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
            }}>

            <Link to="/" className="flex items-center gap-1">

              <span className="text-2xl font-[Good Vibes] font-bold text-[#e0fa84]">
                LearniLM
              </span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="text-2xl"
              >
                🌎
              </motion.span>
              <span className="text-2xl font-[Good Vibes] font-bold text-[#e0fa84]">
                World
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
              <Link to="/about" className="hover:text-[#CBE56A]">About</Link>
              <Link to="/main" className="hover:text-[#CBE56A]">Mentors</Link>
              <Link to="/about#careers" className="hover:text-[#CBE56A]">Careers</Link>
              <Link to="/contact" className="hover:text-[#CBE56A]">Contact</Link>
            </nav>

            <Link
              to="/register"
              className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-[#F64EBB] text-white font-semibold text-sm shadow hover:scale-105 transition"
            >
              Get Started
            </Link>

            <button
              className="md:hidden text-white text-xl"
              onClick={() => setShowOffcanvas(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header> */}

      <Navbar />

      {/* ABOUT SECTION */}
      {/* bg-[#dc8d33] */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-1 md:pt-2 text-center">

          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8
                    rounded-full bg-[#E9C9FF] text-[#5A005F]
                    font-semibold shadow-sm">
            🎓 Transforming Education Globally
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#5A005F]">
            About LearniLM<span className="inline-block mx-1">🌎</span>World
          </h1>

          {/* Subheading */}
          <h2 className="text-2xl md:text-3xl font-semibold text-[#7A1FA2] mb-6">
            Empowering Learners Everywhere
          </h2>

          {/* Description */}
          <p className="max-w-4xl mx-auto text-lg md:text-xl
                  font-medium leading-relaxed mb-10 text-[#2D274B]">
            We are on a mission to make quality education and{" "}
            <span className="font-bold text-[#7A1FA2]">skill-building</span> accessible
            to everyone — through personalized, flexible, and affordable learning
            experiences.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full
                      bg-[#E9C9FF] border border-[#E0C6FF]
                      text-[#5A005F] font-semibold shadow-sm">
              🌍 Global Community
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full
                      bg-[#E9C9FF] border border-[#E0C6FF]
                      text-[#5A005F] font-semibold shadow-sm">
              🎓 Quality Education
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full
                      bg-[#E9C9FF] border border-[#E0C6FF]
                      text-[#5A005F] font-semibold shadow-sm">
              💡 Accessible Learning
            </div>
          </div>

          {/* CTA Button */}
          <Link to="/login">
            <button
              className="px-10 py-4 rounded-full
               bg-[#7A1FA2] hover:bg-[#5A005F]
               transition text-white text-xl font-bold shadow-lg"
            >
              Start Learning Today →
            </button>
          </Link>
        </div>
      </section>

      {/* VISION & CORE VALUES */}
      {/* e0fa84 bg-gradient-to-b from-[#2D274B] to-[#1E1A3A] */}
      {/* OUR VISION & VALUES */}
      <section className="pt-6 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">

          {/* Top Pill */}
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-[#F2B6FF] text-[#5A005F] font-semibold mb-6">
            Our Vision and values
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8">
            <span className="text-black">What We</span>{" "}
            <span className="text-[#6A0075]">Believe In</span>
          </h2>

          {/* Vision Text */}
          <p className="max-w-5xl mx-auto text-lg md:text-xl leading-relaxed text-black mb-20">
            <strong>Our Vision:</strong> To create a world where learning is limitless,
            empowering individuals to explore, innovate, and grow without barriers —
            transforming education into a lifelong adventure.
          </p>

          {/* Values Grid */}
          <div className="grid md:grid-cols-4 gap-8 text-black text-left">

            {/* Empowerment */}
            <div className="bg-[#F8E8FF] rounded-[75px] p-8 border-4 border-black/20">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F2C6FF] text-[#6A0075] mb-5 mx-auto">
                <HandHeart size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-bold mb-3">Empowerment</h3>
              <p className="text-base leading-relaxed">
                We believe in unlocking every learner&apos;s potential through opportunity
                and support.
              </p>
            </div>

            {/* Integrity */}
            <div className="bg-[#F8E8FF] rounded-[75px] p-8 border-4 border-black/20">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F2C6FF] text-[#6A0075] mb-5 mx-auto">
                <ShieldCheck size={28} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-base leading-relaxed">
                We uphold transparency, fairness, and trust in everything we build and
                teach.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-[#F8E8FF] rounded-[75px] p-8 border-4 border-black/20">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F2C6FF] text-[#6A0075] mb-5 mx-auto">
                <Lightbulb size={28} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-base leading-relaxed">
                We constantly evolve through technology to make education smarter and
                more engaging.
              </p>
            </div>

            {/* Community */}
            <div className="bg-[#F8E8FF] rounded-[75px] p-8 border-4 border-black/20">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F2C6FF] text-[#6A0075] mb-5 mx-auto">
                <Users size={28} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-base leading-relaxed">
                We foster a global network where learners and mentors uplift one another.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* OUR STORY */}
      {/*e0fa84  bg-gradient-to-b from-[#dc8d33] to-[#f3b765] text-[#2D274B]  */}
      <section className="py-28 px-6 bg-[#F8E6FF]">
        <div className="max-w-7xl mx-auto">

          {/* Top Pill */}
          <div className="flex justify-center mb-12">
            <span className="px-6 py-2 rounded-full bg-[#E8B3FF] text-[#5A005F] font-semibold">
              Our Story
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-20 items-start">

            {/* LEFT IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src={our_story}
                alt="How LearniLM World Began"
                className="w-full max-w-lg rounded-[75px] object-cover border-3 border-black"
              />
            </motion.div>

            {/* RIGHT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              {/* Heading */}
              <h2 className="text-5xl font-extrabold mb-8 leading-tight">
                How{" "}
                <span className="text-[#C86AF2]">LearniLM</span>{" "}
                <span className="inline-block ">🌎</span>{" "}
                <span className="text-[#C86AF2]">World</span>{" "}
                Began
              </h2>

              {/* Paragraphs */}
              <p className="text-lg leading-relaxed mb-6 text-black max-w-xl">
                What started as a simple idea — to make learning truly personal —
                evolved into a global movement connecting passionate trainers and
                eager learners across the world.
              </p>

              <p className="text-lg leading-relaxed text-black max-w-xl mb-12">
                Through dedication, creativity, and a belief that knowledge should
                have no limits,{" "}
                <span className="font-bold">
                  LearniLM<span className="inline-block mx-1">🌎</span>World
                </span>{" "}
                continues to empower individuals to grow academically,
                professionally, and personally.
              </p>

              {/* QUOTE (RIGHT COLUMN, LEFT ALIGNED) */}
              <div className="relative max-w-xl">
                {/* Shadow Layer */}
                <div className="absolute inset-0 bg-[#5A004F] rounded-full -translate-x-4 translate-y-4"></div>

                {/* Main Card */}
                <div className="relative bg-[#E6A7CF] px-10 py-8 rounded-full">
                  <p className="text-2xl font-bold text-black">
                    “Every learner has a story. Ours is about making each one count.”
                  </p>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* CAREERS */}
      {/* e0fa84 CBE56A*/}
      <section id="careers" className="py-24 px-6 text-[2D274B]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Briefcase size={40} className="mx-auto mb-4 text-[#C86AF2]" />
          </motion.div>

          <h2 className="text-4xl font-serif font-bold text-[#C86AF2]">Careers at LearniLM🌎World</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-[#2D274B]">
            Join a mission-driven team transforming education. Your ideas matter, your growth is
            supported, and your work makes a real impact.
          </p>

          {/* BENEFITS PILLS */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              "Flexible Work Environment",
              "Learning & Development",
              "Inclusive Culture",
              "Competitive Compensation",
            ].map((benefit, i) => (
              <div
                key={i}
                className="px-6 py-3 rounded-full bg-[#F8E8FF] border-2 border-black/80 text-lg font-medium"
              >
                {benefit}
              </div>
            ))}
          </div>

          {/* IMAGE + OPEN POSITIONS */}
          <div className="mt-20 grid md:grid-cols-2 gap-16 items-start text-left">

            {/* LEFT IMAGE */}
            <motion.img
              src={careers_img}
              alt="Team working together"
              className="w-full h-[625px] object-cover rounded-[60px]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />

            {/* RIGHT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-extrabold text-[#9A0FA5] mb-8">
                Open Positions
              </h3>

              {/* INDIA */}
              <div className="bg-[#F8E8FF] border-2 border-black/30 rounded-[48px] p-10 mb-10">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  🇮🇳 India
                </h4>

                <ul className="grid grid-cols-2 gap-y-4 text-lg font-medium">
                  <li>• Sales Intern</li>
                  <li>• Digital Marketing Intern</li>
                  <li>• UX / UI Designer Intern</li>
                  <li>• Q/A Intern</li>
                  <li>• HR Intern</li>
                </ul>
              </div>

              {/* INTERNATIONAL */}
              <div className="bg-[#F8E8FF] border-2 border-black/30 rounded-[48px] p-10">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  🌍 International
                </h4>

                <ul className="grid grid-cols-2 gap-y-4 text-lg font-medium">
                  <li>• Sales Intern – Bahrain</li>
                  <li>• Sales Intern – Belarus</li>
                  <li>• Sales Intern – Oman</li>
                  <li>• Sales Intern – Kuwait</li>
                  <li>• Sales Intern – Azerbaijan</li>
                  <li>• Sales Intern – Jordan</li>
                </ul>
              </div>


            </motion.div>

          </div>

          {/* APPLY BUTTON */}
          <button
            onClick={() => setShowCareerForm(true)}
            className="mt-10 inline-block px-8 py-4 bg-[#F64EBB] text-white font-bold rounded-full hover:scale-105 transition"
          >
            Apply Now →
          </button>

        </div>
        {showCareerForm && (
          <CareerApplicationForm onClose={() => setShowCareerForm(false)} />
        )}


      </section>

      {/* POLICY & REFUND */}
      {/* e0fa84 CBE56A 2D274B */}
      <section
        id="policy-refund"
        className="py-28 px-6 bg-gradient-to-b from-[#F8E6FF] to-[#FDF6FF]"
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-[#E9C9FF] text-[#5A005F] text-sm font-semibold mb-6">
            POLICIES
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Policy & <span className="text-[#C86AF2]">Refund</span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg text-[#2D274B] max-w-3xl mx-auto mb-16">
            We believe in transparency and fairness. Our policies are designed to
            protect learners, trainers, and ensure a smooth learning experience for
            everyone on LearniLM<span className="inline-block mx-1">🌎</span>World.
          </p>

          {/* POLICY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">

            {[
              {
                icon: CreditCard,
                title: "Payment Policy",
                text:
                  "All payments on LearniLM🌎World are processed securely through trusted payment partners. Once a session is successfully booked, you will receive a confirmation via email or dashboard notification.",
              },
              {
                icon: RefreshCcw,
                title: "Refund Eligibility",
                text:
                  "Refunds are applicable if a session is cancelled within the allowed time window or if a trainer fails to attend a scheduled session. Eligible refunds are processed back to the original payment method.",
              },
              {
                icon: CalendarX,
                title: "Cancellations & Rescheduling",
                text:
                  "Learners can cancel or reschedule sessions from their dashboard as per the platform’s cancellation policy. Late cancellations may not qualify for a refund.",
              },
              {
                icon: UserX,
                title: "Trainer No-Show Policy",
                text:
                  "If a trainer does not join a confirmed session without prior notice, learners are entitled to a full refund or a free reschedule, based on preference.",
              },
              {
                icon: XCircle,
                title: "Non-Refundable Cases",
                text:
                  "Refunds are not applicable for completed sessions, partial attendance, or misuse of the platform. Any suspicious activity may lead to account review.",
              },
              {
                icon: LifeBuoy,
                title: "Support & Resolution",
                text:
                  "If you face any issues related to payments or refunds, our support team is here to help. We aim to resolve all refund-related queries within a reasonable timeframe.",
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-[#2D274B] leading-relaxed">{item.text}</p>
                </div>
              )
            })}
          </div>

          {/* FOOTER NOTE */}
          <div className="mt-16 bg-[#F1DBFF] rounded-2xl p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#8A1FA5]">
              <Mail size={20} />
            </div>

            <p className="text-[#2D274B]">
              For detailed refund requests or payment-related concerns, please contact
              us at{" "}
              <span className="font-semibold text-[#8A1FA5]">
                support@learnilmworld.com
              </span>
              . We’re committed to making your learning experience safe, fair, and
              reliable.
            </p>
          </div>

        </div>
      </section>


      {/* BLOG / INSIGHTS */}
      {/* 2D274B CBE56A e0fa84 */}
      <section
        id="blog"
        className="py-28 px-6 bg-gradient-to-b from-[#F8E6FF] to-[#FDF6FF]"
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-[#E9C9FF] text-[#5A005F] text-sm font-semibold mb-6">
            FROM OUR BLOG
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            From the{" "}
            <span className="text-[#C86AF2]">
              LearniLM<span className="inline-block mx-1">🌎</span>World
            </span>{" "}
            Desk
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg text-[#2D274B] max-w-3xl mx-auto mb-16">
            Explore stories, tips, and ideas that inspire learners and educators alike —
            where curiosity meets opportunity.
          </p>

          {/* BLOG CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">

            {[
              {
                title: "How Personalized Learning is Shaping the Future",
                excerpt:
                  "Discover how tailored education approaches are redefining success for modern learners across the globe.",
                image:
                  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "The Power of Mentorship in Digital Learning",
                excerpt:
                  "Behind every great learner is a great mentor. Learn how human connection drives engagement and growth online.",
                image:
                  "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bridging Skills and Opportunities for All",
                excerpt:
                  "At LearniLM🌎World, we're committed to creating accessible pathways that connect learners to real-world possibilities.",
                image:
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
              },
            ].map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="relative">
                  <img src={post.image} className="w-full h-[240px] object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-[#7A1FA2] text-sm font-semibold shadow">
                    # LearnWithPurpose
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#2D274B]">
                    {post.title}
                  </h3>

                  <p className="text-[#2D274B]/80 mb-5 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <span className="text-[#7A1FA2] font-semibold inline-flex items-center gap-1">
                    Read More →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HELP CENTRE */}
      {/* bg-[#2D274B] e0fa84 */}
      <section
        id="help"
        className="py-28 px-6 bg-gradient-to-b from-[#F8E6FF] to-[#FDF6FF] text-[#2D274B]"
      >
        <div className="max-w-4xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-[#E9C9FF] text-[#5A005F] text-sm font-semibold mb-6">
            SUPPORT
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-[#7A1FA2]">Help</span>{" "}
            <span className="text-[#F5B942]">Centre</span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg max-w-3xl mx-auto mb-14 text-[#6B4C7A]">
            Need assistance? Find quick answers and guides to help both learners and
            mentors navigate LearniLM<span className="inline-block mx-1">🌎</span>World
            with ease.
          </p>

          {/* FAQs */}
          <div className="space-y-4 text-left">
            {[
              {
                q: "How do I book a learning session?",
                a: "Go to your dashboard, choose a course or mentor, and click 'Book Session'. You’ll receive a confirmation email instantly after booking.",
              },
              {
                q: "How can I become a trainer on LearniLM World?",
                a: "Submit your profile through the ‘Join as Trainer’ form. Once verified by our team, you’ll be able to create and manage your own sessions.",
              },
              {
                q: "What are your payment and refund policies?",
                a: "Payments are securely processed through our trusted partners. Refunds are available within 7 days for eligible cases under our learner protection policy.",
              },
              {
                q: "How do I manage my schedule or classes?",
                a: "You can update your availability, reschedule classes, or cancel sessions anytime under ‘My Schedule’ in your profile settings.",
              },
              {
                q: "I’m facing technical issues — what should I do?",
                a: "Try refreshing the page or clearing your browser cache first. If the issue persists, contact our support team for quick assistance.",
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group bg-[#F3E8FF] rounded-2xl px-6 py-5 cursor-pointer"
              >
                <summary className="flex justify-between items-center text-lg font-semibold list-none">
                  {faq.q}
                  <span className="text-[#7A1FA2] transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>

                <p className="mt-4 text-[#2D274B]/80 leading-relaxed">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>

          {/* CONTACT LINE (UNCHANGED CONTENT) */}
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-[#6B4C7A]">
              Still need help? Reach out to us anytime at{" "}
              <span className="font-semibold text-[#F5B942]">
                support@learnilmworld.com
              </span>
            </p>
            {/* Feedback Button */}
            <button
              onClick={() => setShowFeedback(true)}
              className="mt-6 bg-[#6B48AF] text-[white] px-6 py-3 rounded-full font-semibold hover:bg-[#F64EBB] transition"
            >
              Give Feedback
            </button>

            {/* Feedback Form */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gray-100 text-[#2D274B] rounded-3xl p-8 w-[90%] max-w-lg relative"
                >
                  {/* Close */}
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="absolute top-4 right-4 text-3xl font-bold text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>

                  <h3 className="text-3xl font-bold mb-6 text-center">
                    We Value Your Feedback 🌟
                  </h3>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={feedbackData.name}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={feedbackData.email}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    />

                    <select
                      value={feedbackData.category}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>

                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      value={feedbackData.message}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b48af]"
                      required
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#F64EBB] text-[white] font-bold py-3 rounded-xl hover:scale-105 transition"
                    >
                      Submit Feedback
                    </button>
                  </form>

                  {feedbackStatus === "success" && (
                    <p className="text-green-600 mt-4 text-center font-semibold">
                      ✅ Thank you! Your feedback has been submitted.
                    </p>
                  )}

                  {feedbackStatus === "error" && (
                    <p className="text-red-500 mt-4 text-center font-semibold">
                      ❌ Failed to send feedback. Please try again.
                    </p>
                  )}
                </motion.div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* TERMS & CONDITIONS */}
      {/* CBE56A 2D274B e0fa84*/}

      <section
        id="terms"
        className="py-28 px-6 bg-gradient-to-b from-[#F8E6FF] to-[#FDF6FF]"
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-[#E9C9FF] text-[#5A005F] text-sm font-semibold mb-6">
            LEGAL
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Terms & <span className="text-[#C86AF2]">Conditions</span>
          </h2>

          {/* SUBTEXT */}
          <p className="mt-4 text-lg text-[#2D274B] max-w-3xl mx-auto mb-16">
            By accessing or using LearniLM<span className="inline-block mx-1">🌎</span>World,
            you agree to our policies and terms. These ensure a safe, transparent,
            and fair learning environment for everyone.
          </p>

          {/* TERMSGRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">

            {/* 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                <UserCheck size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                User Responsibilities & Code of Conduct
              </h3>
              <p className="text-[#2D274B] leading-relaxed">
                Users must provide accurate information, maintain account
                confidentiality, and uphold professionalism. Misuse, fraud,
                or inappropriate conduct may lead to suspension.
              </p>
            </div>

            {/* 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                <CreditCard size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Booking, Payments & Cancellations
              </h3>
              <p className="text-[#2D274B] leading-relaxed">
                All bookings depend on trainer availability. Payments are
                securely processed, and cancellations or reschedules must
                follow platform policies to qualify for refunds.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                <BookOpen size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Intellectual Property Rights
              </h3>
              <p className="text-[#2D274B] leading-relaxed">
                All content, materials, and trademarks on LearniLM World
                belong to LearniLM World or its partners. Unauthorized use
                or redistribution is prohibited.
              </p>
            </div>

            {/* 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                <Scale size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Limitation of Liability
              </h3>
              <p className="text-[#2D274B] leading-relaxed">
                LearniLM World is not liable for indirect or consequential
                losses arising from misuse of the platform. Services are
                provided “as is” within legal limits.
              </p>
            </div>

            {/* 5 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                <Shield size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Privacy & Data Usage
              </h3>
              <p className="text-[#2D274B] leading-relaxed">
                We respect your privacy. Data is collected only to improve
                learning experiences and platform functionality. Personal
                data is never sold or misused.
              </p>
            </div>

            {/* 6 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F1DBFF] flex items-center justify-center text-[#8A1FA5] mb-4">
                <Gavel size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Dispute Resolution & Governing Law
              </h3>
              <p className="text-[#2D274B] leading-relaxed">
                Disputes will be resolved amicably where possible. If
                unresolved, they will be governed under applicable Indian
                law and jurisdiction.
              </p>
            </div>

          </div>

          {/* DISCLAIMER */}
          <p className="mt-16 text-[#2D274B] text-base max-w-3xl mx-auto">
            These terms may be updated periodically to reflect platform or
            legal changes. For queries, contact us at{" "}
            <span className="font-semibold text-[#8A1FA5]">
              legal@learnilmworld.com
            </span>.
          </p>
        </div>
      </section>

      {/* Footer - expanded */}
      <Footer />
    </div>
  )
}
