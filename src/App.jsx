import React from "react";
import { Github, Linkedin, FileText, Shield } from "lucide-react";
import { motion } from "framer-motion";
import "./index.css";

export default function App() {
  const contact = {
    email: "dikeshgautam09@gmail.com",
    phone: "+91-8010948092",
    resume: "/resume.pdf",
    github: "https://github.com/dikesh098",
    linkedin: "https://linkedin.com/in/dikesh-gautam-5a3740227/",
  };
  const tools = ["Python","React.js","React Native","Firebase","Unity","Cybersecurity Basics","Machine Learning","Node.js","Penetration Testing","Networking","Django","TensorFlow"];
  const projects = [
    { title: "E-Sakha (Client Project)", desc: "Responsive React.js website with SEO optimization.", link: "https://www.esakha.in" },
    { title: "Secure Chat App", desc: "React Native chat app with end-to-end encryption.", link: "#" },
    { title: "Phishing Detection System", desc: "ML model to detect phishing websites.", link: "#" },
    { title: "Adaptive Game AI", desc: "Unity adaptive navigation for game agents.", link: "#" },
    { title: "Vulnerability Scanner (Demo)", desc: "Python scanner for common vulnerabilities.", link: "#" },
    { title: "AI Resume Analyzer", desc: "NLP-based resume parser and ranking system using scikit-learn.", link: "#" },
    { title: "Password Strength Analyzer", desc: "Web app evaluating password security with live feedback.", link: "#" },
    { title: "Keylogger Detection Script", desc: "Python tool to detect unauthorized keylogging activities.", link: "#" },
    { title: "Network Packet Analyzer", desc: "Scapy-based analyzer for monitoring unusual traffic patterns.", link: "#" },
    { title: "Cybersecurity Awareness Website", desc: "Educational site to spread awareness about online threats.", link: "#" },
  ];
  const experiences = [
    { title: "Application Developer Intern - NY Online Solutions", period: "Jun 2023 – Dec 2023", details: ["Built React Native apps with Firebase backend.","Improved cross-platform functionality."] },
    { title: "Web Developer Intern - Suvidha Foundation", period: "Dec 2022 – Jan 2023", details: ["Updated CODE KARO YAARO website.","Enhanced UI/UX and accessibility."] },
  ];
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-6 py-10">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield size={26} />
            <div>
              <h1 className="text-2xl font-semibold">Dikesh Gautam</h1>
              <div className="text-sm text-slate-300">Cybersecurity, AI/ML & Full-Stack Developer • Mumbai, India</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href={contact.github} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white/10 rounded inline-flex items-center gap-2"><Github size={16} /> GitHub</a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white/10 rounded inline-flex items-center gap-2"><Linkedin size={16} /> LinkedIn</a>
            <a href={contact.resume} className="px-3 py-2 bg-white/10 rounded inline-flex items-center gap-2"><FileText size={16} /> Resume</a>
          </div>
        </div>
      </motion.header>
      <main className="max-w-6xl mx-auto mt-10 space-y-8">
        <section className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <motion.h2 initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl font-bold">Hi, I'm Dikesh — building secure apps & intelligent systems.</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-300">I am a B.Tech graduate in Artificial Intelligence & Machine Learning with a strong professional focus on cybersecurity, AI/ML, and full-stack development. My expertise spans Python, React.js, React Native, Node.js, Firebase, Django, and TensorFlow, complemented by hands-on knowledge in networking, penetration testing, and secure application design. Through internships and diverse projects, I have developed secure web platforms, AI-driven models, and cybersecurity tools such as phishing detection systems, vulnerability scanners, and encrypted communication apps. With a passion for safeguarding digital ecosystems, I aim to advance as a cybersecurity engineer and AI-enabled developer, contributing to the creation of intelligent, resilient, and secure technological solutions that help organizations stay ahead of evolving cyber threats. I am highly motivated to continue learning emerging security practices, adapting to new challenges, and applying innovative problem-solving approaches to real-world scenarios. My vision is to build a career where I combine cutting-edge technology with proactive security strategies to protect users, businesses, and communities in the digital age.</motion.p>
            <div className="mt-4 flex gap-3">
              <a href="/resume.pdf" className="px-4 py-2 bg-cyan-500 rounded font-semibold text-black">Download Resume</a>
              <a href="#projects" className="px-4 py-2 border rounded">See projects</a>
            </div>
          </div>
          <aside className="hidden lg:block">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <img src="/profile.jpg" alt="Profile" className="w-38 h-45 rounded-lg object-cover mx-auto" />
              <div className="mt-3 text-sm text-slate-300 text-center">{contact.email} • {contact.phone}</div>
            </motion.div>
          </aside>
        </section>
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-semibold">Skills & Tools</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {tools.map(t => (
              <motion.span key={t} whileHover={{ scale: 1.08 }} className="px-3 py-1 rounded-full bg-white/10 border">{t}</motion.span>
            ))}
          </div>
        </section>
        <section id="projects" className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-semibold">Highlighted Projects</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {projects.map(p => (
              <motion.article whileHover={{ y: -6 }} key={p.title} className="p-4 bg-white/10 rounded-lg border">
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-sm text-slate-300 mt-2">{p.desc}</p>
                <a href={p.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline">View</a>
              </motion.article>
            ))}
          </div>
        </section>
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-semibold">Experience</h3>
          <div className="mt-4 space-y-4">
            {experiences.map(e => (
              <div key={e.title} className="p-4 bg-white/10 rounded-lg border">
                <h4 className="font-semibold">{e.title}</h4>
                <div className="text-sm text-slate-400">{e.period}</div>
                <ul className="mt-2 list-disc list-inside text-slate-300 text-sm">{e.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-semibold">Contact</h3>
          <form className="mt-6 grid gap-3" onSubmit={(e) => { e.preventDefault(); alert('Demo: message sent'); }}>
            <input name="name" placeholder="Your name" className="p-3 rounded bg-white/10 border" />
            <input name="email" placeholder="Your email" className="p-3 rounded bg-white/10 border" />
            <textarea name="msg" rows={5} placeholder="Message" className="p-3 rounded bg-white/10 border" />
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-cyan-500 rounded text-black">Send</button>
              <a href="/resume.pdf" className="px-4 py-2 border rounded">Download Resume</a>
            </div>
          </form>
        </section>
      </main>
      <footer className="mt-8 text-sm text-slate-400 text-center">Made with React, Tailwind CSS & Framer Motion • Focus: Cybersecurity, AI/ML & Web</footer>
    </div>
  );
}
