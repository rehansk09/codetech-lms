import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight, ShieldCheck, Globe, ZapOff, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for learners getting started with their journey.",
    features: [
      "Access to free courses",
      "Community forum access",
      "Basic progress tracking",
      "Standard support",
    ],
    buttonText: "Get Started",
    highlighted: false,
    icon: Zap,
  },
  {
    name: "Pro",
    price: "29",
    description: "Unlock the full potential of your learning experience.",
    features: [
      "Everything in Free",
      "All premium courses",
      "Priority instructor meetings",
      "Verified certificates",
      "Advanced quiz analytics",
      "Priority email support",
    ],
    buttonText: "Go Pro Now",
    highlighted: true,
    icon: Sparkles,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for organizations and institutions.",
    features: [
      "Everything in Pro",
      "Bulk license management",
      "Custom curriculum design",
      "Dedicated account manager",
      "API access & Integrations",
      "24/7 white-glove support",
    ],
    buttonText: "Contact Sales",
    highlighted: false,
    icon: Crown,
  },
];

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h3>
    <ul className="mt-4 space-y-3">
      {links.map(([label, href]) => (
        <li key={label}>
          {href.startsWith("mailto:") ? (
            <a href={href} className="text-sm text-slate-500 transition hover:text-blue-600">{label}</a>
          ) : (
            <Link to={href} className="text-sm text-slate-500 transition hover:text-blue-600">{label}</Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const Pricing = () => {
  return (
    <main className="min-h-screen bg-[#fbfcff] text-slate-950 dark:bg-slate-950 dark:text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Stable Background Elements */}
      <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" />
      <div className="absolute -right-20 bottom-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            PRICING PLANS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-8"
          >
            Invest in your <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">future.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            Scale your learning from a curiosity to a career.
            Professional tools for the modern learner.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className={`relative group flex flex-col rounded-[3rem] p-10 transition-all duration-500 ${
                plan.highlighted
                ? "border-2 border-blue-600 bg-white shadow-2xl shadow-blue-500/20 dark:bg-slate-900 z-20"
                : "border border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-5 py-1.5 text-xs font-black text-white shadow-xl uppercase tracking-widest animate-bounce">
                  Most Popular
                </div>
              )}

              <div className="mb-10">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-3xl mb-8 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 ${
                  plan.highlighted ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  <plan.icon className="h-8 w-8" />
                </div>
                <h3 className="text-4xl font-black mb-4">{plan.name}</h3>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">${plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-base text-slate-500 dark:text-slate-400">/mo</span>}
                </div>
              </div>

              <ul className="mb-12 space-y-5 flex-1">
                {plan.features.map((feature) => (
                  <motion.li
                    whileHover={{ x: 10 }}
                    key={feature}
                    className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      plan.highlighted ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className={`flex items-center justify-center gap-3 w-full py-5 px-8 rounded-2xl text-center text-base font-black transition-all duration-300 ${
                    plan.highlighted
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/40 hover:bg-blue-700 hover:shadow-blue-600/60"
                    : "bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100"
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 dark:border-slate-800 pt-16 text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <h4 className="font-bold">Secure Payments</h4>
            <p className="text-sm text-slate-500">Enterprise grade encryption</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            <h4 className="font-bold">Global Access</h4>
            <p className="text-sm text-slate-500">Learn from anywhere, anytime</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ZapOff className="h-8 w-8 text-blue-600" />
            <h4 className="font-bold">No Contracts</h4>
            <p className="text-sm text-slate-500">Cancel your plan anytime</p>
          </div>
        </motion.div>
      </div>

      {/* Footer Section - Mirrored from Home.jsx */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              Codetech<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              The learning platform for discovering courses, teaching students, and tracking meaningful progress.
            </p>
            <div className="mt-6 flex gap-3">
              {[Github, Linkedin, Instagram].map((Icon) => (
                <motion.a
                  key={Icon.displayName || Icon.name}
                  href="#top"
                  whileHover={{ y: -3, backgroundColor: "#2563eb", color: "#ffffff" }}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
          <FooterColumn title="Platform" links={[['Explore courses', '/courseexplore'], ['Pricing', '/pricing'], ['Create an account', '/register']]} />
          <FooterColumn title="Learning" links={[['My dashboard', '/dashboard'], ['Sign in', '/login'], ['Support meetings', '/dashboard']]} />
          <FooterColumn title="Company" links={[['Home', '/'], ['For instructors', '/register'], ['Contact', 'mailto:hello@codetec.com']]} />
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-3 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Codetech. Learning, thoughtfully made.</p>
            <div className="flex gap-5"><span>Privacy</span><span>Terms</span><span>Accessibility</span></div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Pricing;
