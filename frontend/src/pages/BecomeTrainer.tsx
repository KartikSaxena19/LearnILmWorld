import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
// import { Container, Nav, Offcanvas, Button } from "react-bootstrap";
// import logo from '../assets/LearnilmworldLogo.jpg'
import image1 from '../assets/become-trainer2.4.png'
import image2 from '../assets/become-trainer2.2.jpeg'
import image3 from '../assets/become-trainer2.3.jpeg'
// import bg_img from '../assets/purple_gradient.jpg'
// import bg_img from '../assets/header_bg.jpg'
// import bg_main from '../assets/bg_trainer.jpeg'
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const BecomeTrainer: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // const [showOffcanvas, setShowOffcanvas] = useState(false);

  return (
    <div className="bg-fixed min-h-screen overflow-x-hidden text-[#e0fa84] bg-[#fef5e4]"
      
    >
      {/* text-[#e0fa84] text-[#2D274B] */}
      <Navbar/>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#5186cd] mb-6 leading-tight"
            >
              Empower Learners, <br />
              Inspire Growth 🌟
            </motion.h1>

            <motion.p
              className="max-w-xl mx-auto lg:mx-0 font-semibold text-lg sm:text-xl text-[#2D274B] mb-10"
            >
              Join LearniLM🌍World as a Trainer and help students achieve their goals while
              growing your career in a flexible, rewarding environment.
            </motion.p>

            <motion.button
              onClick={() => navigate("/register?role=trainer")}
              className="px-10 py-4 bg-[#276dc9] text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#205eb0]"
              whileHover={{ scale: 1.05 }}
            >
              Become a Trainer Today
            </motion.button>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <img
              src={image2}
              alt="Trainer Collaboration"
              className="
          w-full
          max-w-xl
          lg:max-w-2xl
          rounded-3xl
          shadow-xl
          object-cover
        "
            />
          </motion.div>

        </div>
      </section>

      {/*  Text Section + 1 Big Image */}
      <section className="py-10 px-6 md:px-16 flex flex-column  md:flex-row items-center gap-10 max-w-6xl mx-auto">
        {/* text + list ul */}
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div>
            <h2 className="text-5xl md:text-5xl font-bold text-[#5186cd] mx-auto">
              Teach, Inspire, and Make a Difference
            </h2>
          </div>

          <div>

            <p className="text-xl font-bold text-[#2D274B] leading-relaxed">
              At LearniLM World, we believe in empowering individuals through knowledge.
              As a trainer, you’ll help learners from diverse backgrounds gain confidence,
              improve communication, and unlock new opportunities in their lives.
            </p>
            <div className="flex flex-row gap-20">
              <div>
                <ul className="list-disc list-outside text-xl text-[#2D274B] font-bold space-y-2">
                  <li>Flexible working hours and teaching freedom</li>
                  <li>Access to a supportive and growing learning community</li>
                  <li>Opportunity to reach learners from around the world</li>
                </ul>
              </div>

              {/* <div>
                <button
                  onClick={() => navigate("/register?role=trainer")}
                  className="mt-6 px-8 py-3 bg-[#F64EBB] text-[white] rounded-full font-semibold hover:bg-[#f92eb2] transition-all"
                >
                  Become a Trainer Today
                </button>
              </div> */}
            </div>

          </div>


        </motion.div>

        {/* stretched image */}
        <div className="w-full px-4">
          <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-lg aspect-[7/2]">
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={image3}
                alt="Trainer Relaxing Illustration"
                className=" w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>
        </div>

        {/*Text Under Images */}
        <div>
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ul className="gap-4 text-lg text-[#2D274B] font-bold grid grid-cols-1 md:grid-cols-2">
              <li className="flex items-start border-gray-400 rounded-full px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Continuous Flow of Learners —<br /> Reach motivated students from around the world.
              </li>
              <li className="flex items-start border-gray-400 rounded-full px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Smart Scheduling Tools —<br /> Manage your sessions effortlessly with our intuitive calendar.
              </li>
              <li className="flex items-start border-gray-400 rounded-full px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Interactive Virtual Classrooms —<br /> Engage your students with real-time learning tools.
              </li>
              <li className="flex items-start border-gray-400 rounded-full px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Secure & Flexible Payments —<br /> Get paid easily, wherever you are.
              </li>
              <li className="flex items-start border-gray-400 rounded-full px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Growth-Focused Training —<br /> Access exclusive webinars and teaching resources.
              </li>
              <li className="flex items-start border-gray-400 rounded-full px-8 py-4 shadow-sm text-start bg-white/80 gap-3">
                <span className="text-[#5186cd] text-xl">✔</span>
                Thriving Educator Community — <br /> Connect, share, and collaborate with fellow mentors.
              </li>
            </ul>

          </motion.div>
        </div>

      </section>

      {/* Global Teaching Section */}
      {/* <section className="py-20 px-6 md:px-16  flex flex-col-reverse md:flex-row items-center gap-10 max-w-6xl mx-auto rounded-2xl shadow-sm">

       
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={image2}
            alt="Global teaching"
            className="rounded-2xl shadow-lg w-full max-w-lg object-cover"
          />
        </motion.div>

      </section> */}

      {/* Benefits Section */}
      {/* e0fa84 bg-[#2D274B] */}
      <section className=" pt-16 px-6 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#5186cd] mb-12">
          Why Teach with LearniLM🌍World?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto ">
          {[
            {
              title: "Flexible Schedule",
              desc: "Teach at your convenience from anywhere. Your time, your rules.",
              icon: "⏰",
            },
            {
              title: "Global Reach",
              desc: "Connect with students worldwide and make an impact beyond boundaries.",
              icon: "🌍",
            },
            {
              title: "Rewarding Experience",
              desc: "Earn while helping learners achieve their dreams — a win for everyone.",
              icon: "💼",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-blue-50 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all hover:bg-[#e5f2b4] font-semibold"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#8CA0E5] mb-2">{item.title}</h3>
              <p className="text-[#2D274B] font-semibold">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </section>

      {/* Testimonials Section - trainer review */}
      {/* bg-[#2D274B]  e0fa84*/}
      <section className=" py-12 px-6 ">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 text-[#5186cd]">
          Straight from the Heart ❤️
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 ">
          {[
            {
              quote:
                "Teaching at LearnOsphere has given me the freedom to connect with passionate learners and grow my skills every day.",
              name: "Aarav Sharma",
              role: "IELTS Trainer",
            },
            {
              quote:
                "The best part is the flexibility — I can teach students globally from the comfort of my home.",
              name: "Neha Verma",
              role: "Spoken English Coach",
            },
            {
              quote:
                "LearnOsphere’s community of trainers is amazing. You always feel supported and valued.",
              name: "Ravi Kumar",
              role: "Communication Skills Trainer",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all hover:bg-[#e5f2b4] font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              <p className="italic text-[#2D274B] mb-4">“{t.quote}”</p>
              <div className="font-bold text-blue-700">{t.name}</div>
              <div className="text-sm font-bold text-[#2D274B]">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/*Image on Top + Then Trainer FAQs Section */}
      <section
        className="py-8 "
        aria-labelledby="trainer-faq"
      >
        <motion.div
          className="w-full px-4 pb-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-lg aspect-[7/2]">
            <img
              src={image1}
              alt="Global teaching"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              id="trainer-faq"
              className="text-4xl md:text-4xl font-extrabold text-[#5186cd]"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-[#2D274B] text-lg font-bold max-w-2xl mx-auto">
              Everything you need to know before starting your teaching journey with
              LEARNiLM🌎WORLD.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What kind of trainers do you look for?",
                a: "We welcome anyone passionate about teaching — no formal certification needed. If you love sharing knowledge, have good communication skills, and can personalize learning for global students, you’re a great fit.",
              },
              {
                q: "What subjects can I teach?",
                a: "You can teach from a wide range — from languages to academic and skill-based subjects. If you’re skilled in something, there’s likely a learner waiting for you!",
              },
              {
                q: "How do I become a trainer?",
                a: "Simply create your trainer profile, upload a photo, describe your teaching style, and record a short intro video. Once you complete these steps, our team reviews your profile within 2–3 business days.",
              },
              {
                q: "How can I get my profile approved quickly?",
                a: "Use a clear, real photo, add a short 1–2 minute video, and write an authentic description of your strengths. Avoid adding contact details or pricing in your profile to speed up approval.",
              },
              {
                q: "Why teach with LEARNiLM🌎WORLD?",
                a: "You earn while helping students learn, set your own schedule, reach learners globally, and receive secure payments. Plus, you get access to growth webinars, community support, and built-in teaching tools.",
              },
              {
                q: "How much can I earn?",
                a: "Top trainers earn between ₹15,000–₹65,000 ($180–$780) per month depending on your hourly rate, session count, and student retention. You can adjust your rates anytime.",
              },
              {
                q: "What equipment do I need?",
                a: "A laptop or desktop, stable internet, webcam, and microphone are all you need to teach effectively in our virtual classroom.",
              },
              {
                q: "Is there any joining cost?",
                a: "It’s completely free to create your profile and start teaching. Learn🌎Sphere only takes a small commission per lesson to maintain platform quality and marketing reach.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg bg-white shadow-sm font-bold hover:shadow-md transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left text-[#2D274B] font-bold text-base focus:outline-none"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronDown className="w-4 h-4 text-[#0ea5a3]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 text-slate-600 text-sm leading- font-bold"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-20 px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold mb-6 text-[#2D274B]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Start Your Journey as a Trainer?
        </motion.h2>
        <motion.button
          onClick={() => navigate("/register?role=trainer")}
          className="px-10 py-4  bg-white  text-[#276dc9] font-semibold text-lg rounded-full shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Get Started Now
        </motion.button>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeTrainer;
