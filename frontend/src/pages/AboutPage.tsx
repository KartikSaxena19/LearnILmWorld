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

  // style={{
  //   backgroundImage:
  //     `url(${bg_img})`,
  //   position: "relative",
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  //   backgroundRepeat: "no-repeat",
  //   width: "100%",
  // }}

  return (

    <div className="min-h-screen font-inter bg-[#fef5e4] text-black scroll-smooth"
    >

      <Navbar />
      {/* ABOUT SECTION */}
      {/* bg-[#dc8d33] */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center bg-[#fef5e4]"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-20 text-center">

          {/* Top Pill */}
          <div
            className="inline-flex items-center gap-2 px-6 py-2 mb-10
      rounded-full bg-white text-[#5186cd]
      font-bold shadow-md border border-[#5186cd]/20"
          >
            🎓 Transforming Education Globally
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#1f2937]">
            About{" "}
            <span className="text-[#5186cd]">LearniLM</span>
            <span className="inline-block mx-1">🌍</span>
            <span className="text-[#5186cd]">World</span>
          </h1>

          {/* Subheading */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#5186cd] mb-6">
            Empowering Learners Everywhere
          </h2>

          {/* Description */}
          <p className="max-w-4xl mx-auto text-lg md:text-xl
      font-medium leading-relaxed mb-12 text-gray-700">
            We are on a mission to make quality education and{" "}
            <span className="font-bold text-[#5186cd]">skill-building</span>{" "}
            accessible to everyone — through personalized, flexible, and affordable learning
            experiences.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6 mb-14">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full
        bg-white border border-[#5186cd]/20
        text-[#5186cd] font-bold shadow-sm">
              🌍 Global Community
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full
        bg-white border border-[#5186cd]/20
        text-[#5186cd] font-bold shadow-sm">
              🎓 Quality Education
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full
        bg-white border border-[#5186cd]/20
        text-[#5186cd] font-bold shadow-sm">
              💡 Accessible Learning
            </div>
          </div>

          {/* CTA Button */}
          <Link to="/login">
            <button
              className="px-10 py-4 rounded-full
        bg-[#276dc9] hover:bg-[#205eb0]
        transition text-white text-xl font-bold shadow-xl"
            >
              Start Learning Today →
            </button>
          </Link>

        </div>
      </section>

      {/* e0fa84 bg-gradient-to-b from-[#2D274B] to-[#1E1A3A] */}
      {/* OUR VISION & VALUES */}
      <section className="pt-16 pb-20 px-6 bg-[#fef5e4]">
        <div className="max-w-7xl mx-auto text-center">

          {/* Top Pill */}
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white text-[#276dc9] font-bold shadow-md border border-[#5186cd]/20 mb-8">
            Our Vision & Values
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-[#1f2937]">
            What We{" "}
            <span className="text-[#5186cd]">Believe In</span>
          </h2>

          {/* Vision Text */}
          <p className="max-w-5xl mx-auto text-lg md:text-xl leading-relaxed text-gray-700 mb-16">
            <strong className="text-[#5186cd]">Our Vision:</strong> To create a world where learning is limitless,
            empowering individuals to explore, innovate, and grow without barriers — transforming education
            into a lifelong adventure.
          </p>

          {/* Values Grid */}
          <div className="grid md:grid-cols-4 gap-8 text-black text-left">

            {/* Empowerment */}
            <div className="bg-[#e9f1fb] rounded-[75px] p-8 border-4 border-[#5186cd]/40">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#cfe0f7] text-[#276dc9] mb-5 mx-auto">
                <HandHeart size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-[#1f2937]">Empowerment</h3>
              <p className="text-base leading-relaxed text-gray-700">
                We believe in unlocking every learner&apos;s potential through opportunity
                and support.
              </p>
            </div>

            {/* Integrity */}
            <div className="bg-[#e9f1fb] rounded-[75px] p-8 border-4 border-[#5186cd]/40">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#cfe0f7] text-[#276dc9] mb-5 mx-auto">
                <ShieldCheck size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-[#1f2937]">Integrity</h3>
              <p className="text-base leading-relaxed text-gray-700">
                We uphold transparency, fairness, and trust in everything we build and teach.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-[#e9f1fb] rounded-[75px] p-8 border-4 border-[#5186cd]/40">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#cfe0f7] text-[#276dc9] mb-5 mx-auto">
                <Lightbulb size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-[#1f2937]">Innovation</h3>
              <p className="text-base leading-relaxed text-gray-700">
                We constantly evolve through technology to make education smarter and
                more engaging.
              </p>
            </div>

            {/* Community */}
            <div className="bg-[#e9f1fb] rounded-[75px] p-8 border-4 border-[#5186cd]/40">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#cfe0f7] text-[#276dc9] mb-5 mx-auto">
                <Users size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-[#1f2937]">Community</h3>
              <p className="text-base leading-relaxed text-gray-700">
                We foster a global network where learners and mentors uplift one another.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* OUR STORY */}
      {/*e0fa84  bg-gradient-to-b from-[#dc8d33] to-[#f3b765] text-[#2D274B]  */}
      <section className="py-28 px-6 bg-[#fef4e4]">
        <div className="max-w-7xl mx-auto">

          {/* Top Pill */}
          <div className="flex justify-center mb-12">
            <span className="px-6 py-2 rounded-full bg-white text-[#276dc9] font-bold shadow-md border border-[#5186cd]/20">
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
                className="w-full max-w-lg rounded-[75px] object-cover border-4 border-[#5186cd]/40"
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
              <h2 className="text-5xl font-extrabold mb-8 leading-tight text-[#1f2937]">
                How{" "}
                <span className="text-[#5186cd]">LearniLM</span>{" "}
                <span className="inline-block">🌎</span>{" "}
                <span className="text-[#5186cd]">World</span>{" "}
                Began
              </h2>

              {/* Paragraphs */}
              <p className="text-lg leading-relaxed mb-6 text-gray-700 max-w-xl">
                What started as a simple idea — to make learning truly personal —
                evolved into a global movement connecting passionate trainers and
                eager learners across the world.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 max-w-xl mb-12">
                Through dedication, creativity, and a belief that knowledge should
                have no limits,{" "}
                <span className="font-bold text-[#5186cd]">
                  LearniLM<span className="inline-block mx-1">🌎</span>World
                </span>{" "}
                continues to empower individuals to grow academically,
                professionally, and personally.
              </p>

              {/* QUOTE */}
              <div className="relative max-w-xl">
                {/* Shadow Layer */}
                <div className="absolute inset-0 bg-[#5186cd] rounded-full -translate-x-4 translate-y-4 opacity-20"></div>

                {/* Main Card */}
                <div className="relative bg-[#e9f1fb] px-10 py-8 rounded-full border border-[#5186cd]/30 shadow-md">
                  <p className="text-2xl font-bold text-[#1f2937]">
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
      <section id="careers" className="py-24 px-6 text-[#2D274B] bg-[#fef5e4]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Briefcase size={40} className="mx-auto mb-4 text-[#276dc9]" />
          </motion.div>

          <h2 className="text-4xl font-serif font-bold text-[#5186cd]">
            Careers at LearniLM🌎World
          </h2>
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
                className="px-6 py-3 rounded-full bg-[#e9f1fb] border-2 border-[#5186cd]/40 text-lg font-medium"
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
              className="w-full h-[625px] object-cover rounded-[60px] border-4 border-[#5186cd]/30"
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
              <h3 className="text-4xl font-extrabold text-[#5186cd] mb-8">
                Open Positions
              </h3>

              {/* INDIA */}
              <div className="bg-[#e9f1fb] border-2 border-[#5186cd]/30 rounded-[48px] p-10 mb-10">
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
              <div className="bg-[#e9f1fb] border-2 border-[#5186cd]/30 rounded-[48px] p-10">
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

          {/* APPLY BUTTON — ONLY BUTTON COLOR CHANGED */}
          <button
            onClick={() => setShowCareerForm(true)}
            className="mt-10 inline-block px-8 py-4 bg-[#276dc9] hover:bg-[#205eb0] text-white font-bold rounded-full hover:scale-105 transition"
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
        className="py-28 px-6 bg-[#e9f1fb]"
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold mb-6 shadow border border-[#5186cd]/20">
            POLICIES
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#1f2937]">
            Policy & <span className="text-[#5186cd]">Refund</span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
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
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-[#5186cd]/15"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#fef5e4] flex items-center justify-center text-[#276dc9] mb-4">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              )
            })}
          </div>

          {/* FOOTER NOTE */}
          <div className="mt-16 bg-white rounded-2xl p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center text-center sm:text-left border border-[#5186cd]/20 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#e9f1fb] flex items-center justify-center text-[#276dc9]">
              <Mail size={20} />
            </div>

            <p className="text-gray-700">
              For detailed refund requests or payment-related concerns, please contact
              us at{" "}
              <span className="font-semibold text-[#5186cd]">
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
        className="py-28 px-6 bg-[#e1edfc]"
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold mb-6 shadow border border-[#5186cd]/20">
            FROM OUR BLOG
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#1f2937]">
            From the{" "}
            <span className="text-[#5186cd]">
              LearniLM<span className="inline-block mx-1">🌎</span>World
            </span>{" "}
            Desk
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
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
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden border border-[#5186cd]/10"
              >
                <div className="relative">
                  <img src={post.image} className="w-full h-[240px] object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[#276dc9] text-sm font-semibold shadow border border-[#5186cd]/20">
                    # LearnWithPurpose
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#1f2937]">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-5 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <span className="text-[#5186cd] font-semibold inline-flex items-center gap-1 hover:underline">
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
        className="py-28 px-6 bg-gradient-to-br from-[#5186cd] via-[#6ea0e0] to-[#fef5e4] text-white"
      >
        <div className="max-w-4xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold mb-6 shadow">
            SUPPORT
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-white">Help</span>{" "}
            <span className="text-[#fef5e4]">Centre</span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-lg max-w-3xl mx-auto mb-14 text-white/90">
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
                className="group bg-white/90 rounded-2xl px-6 py-5 cursor-pointer text-[#1f2937] shadow"
              >
                <summary className="flex justify-between items-center text-lg font-semibold list-none">
                  {faq.q}
                  <span className="text-[#5186cd] transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>

          {/* CONTACT LINE */}
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-white/90">
              Still need help? Reach out to us anytime at{" "}
              <span className="font-semibold text-[#fef5e4]">
                support@learnilmworld.com
              </span>
            </p>

            {/* Feedback Button */}
            <button
              onClick={() => setShowFeedback(true)}
              className="mt-6 bg-white text-[#276dc9] px-6 py-3 rounded-full font-bold shadow hover:bg-[#fef5e4] transition"
            >
              Give Feedback
            </button>

            {/* Feedback Form */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#fef5e4] text-[#1f2937] rounded-3xl p-8 w-[90%] max-w-lg relative shadow-xl"
                >
                  {/* Close */}
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="absolute top-4 right-4 text-3xl font-bold text-[#5186cd] hover:text-[#3f6fb0]"
                  >
                    ×
                  </button>

                  <h3 className="text-3xl font-extrabold mb-6 text-center text-[#5186cd]">
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={feedbackData.email}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    />

                    <select
                      value={feedbackData.category}
                      onChange={(e) =>
                        setFeedbackData({ ...feedbackData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                      required
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#5186cd] hover:bg-[#3f6fb0] text-white font-bold py-3 rounded-xl hover:scale-105 transition"
                    >
                      Submit Feedback
                    </button>
                  </form>

                  {feedbackStatus === "success" && (
                    <p className="text-[#5186cd] mt-4 text-center font-semibold">
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
        className="py-28 px-6 bg-[#eef4fc]"
      >
        <div className="max-w-7xl mx-auto text-center">

          {/* TOP PILL */}
          <div className="inline-flex px-5 py-2 rounded-full bg-[#5186cd] text-white text-sm font-bold mb-6 shadow">
            LEGAL
          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#1f2937]">
            Terms & <span className="text-[#5186cd]">Conditions</span>
          </h2>

          {/* SUBTEXT */}
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto mb-16">
            By accessing or using LearniLM<span className="inline-block mx-1">🌎</span>World,
            you agree to our policies and terms. These ensure a safe, transparent,
            and fair learning environment for everyone.
          </p>

          {/* TERMS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">

            {/* 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#e3edfb] flex items-center justify-center text-[#5186cd] mb-4">
                <UserCheck size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                User Responsibilities & Code of Conduct
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Users must provide accurate information, maintain account
                confidentiality, and uphold professionalism. Misuse, fraud,
                or inappropriate conduct may lead to suspension.
              </p>
            </div>

            {/* 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#e3edfb] flex items-center justify-center text-[#5186cd] mb-4">
                <CreditCard size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                Booking, Payments & Cancellations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All bookings depend on trainer availability. Payments are
                securely processed, and cancellations or reschedules must
                follow platform policies to qualify for refunds.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#e3edfb] flex items-center justify-center text-[#5186cd] mb-4">
                <BookOpen size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                Intellectual Property Rights
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All content, materials, and trademarks on LearniLM World
                belong to LearniLM World or its partners. Unauthorized use
                or redistribution is prohibited.
              </p>
            </div>

            {/* 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#e3edfb] flex items-center justify-center text-[#5186cd] mb-4">
                <Scale size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                Limitation of Liability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                LearniLM World is not liable for indirect or consequential
                losses arising from misuse of the platform. Services are
                provided “as is” within legal limits.
              </p>
            </div>

            {/* 5 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#e3edfb] flex items-center justify-center text-[#5186cd] mb-4">
                <Shield size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                Privacy & Data Usage
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We respect your privacy. Data is collected only to improve
                learning experiences and platform functionality. Personal
                data is never sold or misused.
              </p>
            </div>

            {/* 6 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#e3edfb] flex items-center justify-center text-[#5186cd] mb-4">
                <Gavel size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1f2937]">
                Dispute Resolution & Governing Law
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Disputes will be resolved amicably where possible. If
                unresolved, they will be governed under applicable Indian
                law and jurisdiction.
              </p>
            </div>

          </div>

          {/* DISCLAIMER */}
          <p className="mt-16 text-gray-700 text-base max-w-3xl mx-auto">
            These terms may be updated periodically to reflect platform or
            legal changes. For queries, contact us at{" "}
            <span className="font-semibold text-[#5186cd]">
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
