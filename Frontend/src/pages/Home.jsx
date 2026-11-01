import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Play,
  Sparkles,
  Star,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Course from "./Course";

gsap.registerPlugin(ScrollTrigger);

const learningBrands = [
  { name: "Udemy", domain: "udemy.com" },
  { name: "Coursera", domain: "coursera.org" },
  { name: "edX", domain: "edx.org" },
  { name: "Skillshare", domain: "skillshare.com" },
  { name: "Khan Academy", domain: "khanacademy.org" },
];

const Home = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".product-preview",
        { autoAlpha: 0, y: 50, rotateX: 7 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          delay: 0.25,
          ease: "power4.out",
        },
      );

      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 84%" },
          },
        );
      });

      gsap.to(".orb-one", {
        x: 50,
        y: 26,
        duration: 5.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(".orb-two", {
        x: -36,
        y: 38,
        duration: 6.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(".brand-marquee-track", {
        xPercent: -50,
        duration: 11,
        ease: "none",
        repeat: -1,
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="overflow-hidden bg-[#fbfcff] text-slate-950 dark:bg-slate-950 dark:text-white"
    >
      <section className="relative isolate border-b border-slate-200/70 bg-[radial-gradient(circle_at_50%_-15%,#dbeafe_0,transparent_42%)] px-4 pb-20 pt-16 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_50%_-15%,#172554_0,transparent_42%)] sm:px-6 lg:pb-28 lg:pt-24">
        <div className="orb-one pointer-events-none absolute left-1/2 top-20 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
        <div className="orb-two pointer-events-none absolute -left-20 bottom-20 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            The all-in-one LMS for learners and instructors
          </div>
          <h1 className="hero-reveal mx-auto mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Learn with purpose.{" "}
            <span className="text-blue-600">Teach with impact.</span>
          </h1>
          <p className="hero-reveal mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Create and sell courses, track learner progress, run assessments,
            and offer instructor support from one modern learning platform.
          </p>
          <div className="hero-reveal mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/15 dark:bg-white dark:text-slate-950"
              >
                Start learning free <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/courseexplore"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
              >
                Explore courses <BookOpen className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="product-preview relative mx-auto mt-14 max-w-6xl rounded-[2rem] border border-white/70 bg-slate-950 p-2 shadow-2xl shadow-blue-900/20 dark:border-slate-700">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-5 -top-5 hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-left shadow-xl backdrop-blur lg:block"
          >
            <p className="text-xs font-semibold text-slate-500">
              Learning streak
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              4 days ✦
            </p>
          </motion.div>
          <div className="overflow-hidden rounded-[1.6rem] bg-[#101827] p-5 text-left sm:p-8">
            <div className="flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <i className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-7 grid gap-5 lg:grid-cols-[.82fr_1.6fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-300">
                  Learner dashboard
                </p>
                <p className="mt-4 text-lg font-semibold text-white">
                  Welcome back, Alex.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Resume your course",
                    "Complete this lesson quiz",
                    "Instructor meeting scheduled",
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-lg ${
                          index === 0 ? "bg-blue-500" : "bg-white/10"
                        }`}
                      >
                        {index === 0 ? (
                          <Play className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" />
                        )}
                      </span>
                      <span className="text-sm text-slate-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/30 to-indigo-500/10 p-5 sm:p-7">
                <p className="text-sm font-medium text-blue-100">
                  JavaScript foundations
                </p>
                <h2 className="mt-2 max-w-md text-3xl font-semibold tracking-tight text-white">
                  Continue learning, complete lessons, and track your progress.
                </h2>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <Metric label="Lessons" value="12" />
                  <Metric label="Quiz score" value="92%" />
                  <Metric label="Progress" value="On track" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-[#151515] px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-sm">
            Inspired by the learning platforms students know and trust
          </p>
          <div className="mt-7 overflow-hidden">
            <div className="brand-marquee-track flex w-[200%] items-center">
              {[...learningBrands, ...learningBrands].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex w-[10%] shrink-0 items-center justify-center gap-2.5 opacity-70 transition-opacity hover:opacity-100"
                >
                  <img
                    src={`https://logo.clearbit.com/${brand.domain}`}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain grayscale brightness-0 invert"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-xl font-bold tracking-[-0.05em] text-white sm:text-2xl">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section page-frame py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Built for better learning</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
            Everything your LMS needs, connected.
          </h2>
          <p className="mt-4 text-slate-500">
            From course discovery to completion certificates, Codetech keeps
            learners, instructors, and learning progress in one connected place.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Feature
            icon={BookOpen}
            title="Structured course learning"
            copy="Give learners video lessons, curriculum modules, quizzes, and a clear path to finish."
          />
          <Feature
            icon={UsersRound}
            title="Instructor support"
            copy="Let enrolled learners request one-to-one meetings when they need guidance."
          />
          <Feature
            icon={Star}
            title="Track and certify progress"
            copy="Turn completed lessons and assessments into a certificate and learning record."
          />
        </div>
      </section>

      <Course />

      <section className="reveal-section border-y border-slate-800 bg-[#151515] py-20 text-white sm:py-24">
        <div className="page-frame py-0">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              The learning shift
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Active learning vs. passive watching
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Why meaningful practice outperforms a static video catalog.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <motion.article
              whileHover={{ y: -5 }}
              className="rounded-lg bg-[#1d1d1d] p-7 sm:p-8"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <X className="h-4 w-4 text-rose-300" />
                Traditional course platforms
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-400">
                <li className="flex gap-3">
                  <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-300" />
                  Long video playlists with little accountability.
                </li>
                <li className="flex gap-3">
                  <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-300" />
                  Generic quizzes that measure recall, not real understanding.
                </li>
                <li className="flex gap-3">
                  <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-300" />
                  One rigid sequence for every learner, regardless of progress.
                </li>
                <li className="flex gap-3">
                  <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-300" />
                  Completion certificates without an ongoing learning record.
                </li>
              </ul>
              <p className="mt-12 text-xs text-slate-500">
                Result: watching more, retaining less.
              </p>
            </motion.article>
            <motion.article
              whileHover={{ y: -5 }}
              className="rounded-lg border border-white/5 bg-gradient-to-br from-[#303030] to-[#292929] p-7 sm:p-8"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-300">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Codetech learning experience
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-100">
                <li className="flex gap-3">
                  <Zap className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  Structured courses with clear next steps and progress
                  tracking.
                </li>
                <li className="flex gap-3">
                  <Zap className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  Knowledge checks that reinforce the lessons you complete.
                </li>
                <li className="flex gap-3">
                  <Zap className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  Direct meeting requests when you need instructor support.
                </li>
                <li className="flex gap-3">
                  <Zap className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  Certificates and a personal library that captures your
                  progress.
                </li>
              </ul>
              <p className="mt-12 text-xs font-medium text-cyan-300">
                Result: a clearer path from first lesson to real progress.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="reveal-section page-frame py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-blue-600 px-6 py-14 text-white shadow-xl shadow-blue-600/20">
          <p className="text-sm font-semibold text-blue-100">
            Start your learning journey
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Join courses built to help you grow.
          </h2>
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700"
            >
              Create learner account <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="page-frame grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-slate-950 dark:text-white"
            >
              Codetech<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              The learning platform for discovering courses, teaching students,
              and tracking meaningful progress.
            </p>
            <div className="mt-6 flex gap-3">
              {[Github, Linkedin, Instagram].map((Icon) => (
                <motion.a
                  key={Icon.displayName || Icon.name}
                  href="#top"
                  whileHover={{
                    y: -3,
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                  }}
                  aria-label="Codetech social link"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              ["Explore courses", "/courseexplore"],
              ["Pricing", "/pricing"],
              ["Create an account", "/register"],
            ]}
          />
          <FooterColumn
            title="Learning"
            links={[
              ["My dashboard", "/dashboard"],
              ["Sign in", "/login"],
              ["Support meetings", "/dashboard"],
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              ["Home", "/"],
              ["For instructors", "/register"],
              ["Contact", "mailto:hello@codetec.com"],
            ]}
          />
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800">
          <div className="page-frame flex flex-col gap-3 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Codetech. Learning, thoughtfully
              made.
            </p>
            <div className="flex gap-5">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

const Metric = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
  </div>
);

const Feature = ({ icon: Icon, title, copy }) => (
  <motion.article
    whileHover={{ y: -7, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
      <Icon className="h-5 w-5" />
    </span>
    <h3 className="mt-6 text-xl font-semibold">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-500">{copy}</p>
  </motion.article>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
      {title}
    </h3>
    <ul className="mt-4 space-y-3">
      {links.map(([label, href]) => (
        <li key={label}>
          {href.startsWith("mailto:") ? (
            <a
              href={href}
              className="text-sm text-slate-500 transition hover:text-blue-600"
            >
              {label}
            </a>
          ) : (
            <Link
              to={href}
              className="text-sm text-slate-500 transition hover:text-blue-600"
            >
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Home;
