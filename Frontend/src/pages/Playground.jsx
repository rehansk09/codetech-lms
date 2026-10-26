import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Trash2, Code2, Terminal, Sparkles, Github, Linkedin, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Link } from "react-router-dom";

const LANGUAGE_CONFIG = {
  python3: { name: "Python", version: "3.10.0", defaultCode: 'print("Hello, World!")', color: "text-yellow-400" },
  javascript: { name: "JavaScript", version: "18.15.0", defaultCode: 'console.log("Hello, World!");', color: "text-yellow-300" },
  java: { name: "Java", version: "15.0.2", defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}', color: "text-red-400" },
  cpp: { name: "C++", version: "10.2.0", defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  csharp: { name: "C#", version: "6.12.0", defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}', color: "text-purple-400" },
};

const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h3>
    <ul className="space-y-3">
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

const Playground = () => {
  const [language, setLanguage] = useState("python3");
  const [code, setCode] = useState(LANGUAGE_CONFIG.python3.defaultCode);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    // Removed GSAP entrance animations for instant page load
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(LANGUAGE_CONFIG[newLang].defaultCode);
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput("Executing code...");
    try {
      if (language === "javascript") {
        try {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => String(a)).join(" ")),
            error: (...args) => logs.push(`Error: ${args.map(a => String(a)).join(" ")}`),
            warn: (...args) => logs.push(`Warning: ${args.map(a => String(a)).join(" ")}`),
          };
          const executeCode = new Function("console", code);
          executeCode(customConsole);
          setOutput(logs.join("\\n") || "Code executed successfully, but produced no output.");
        } catch (err) {
          setOutput(`Runtime Error: ${err.message}`);
        }
        setIsLoading(false);
        return;
      }

      const fileExtensions = {
        python3: "main.py",
        java: "Main.java",
        cpp: "main.cpp",
        csharp: "Program.cs",
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/playground/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: language,
            version: LANGUAGE_CONFIG[language].version,
            files: [
              { name: fileExtensions[language] || "main", content: code },
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        setOutput(`API Error: ${data.error}`);
      } else if (data.run) {
        const { output, stderr, compile } = data.run;
        if (compile) {
          setOutput(`Compile Error:\\n${compile}`);
        } else if (stderr) {
          setOutput(`Runtime Error:\\n${stderr}`);
        } else if (output) {
          setOutput(output);
        } else {
          setOutput("Code executed successfully, but produced no output.");
        }
      } else {
        setOutput("Unexpected response format from the server.");
      }
    } catch (error) {
      setOutput(`System Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearOutput = () => setOutput("");

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="pg-header mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 relative">
              <div className="p-1 bg-blue-600 rounded-md shadow-lg shadow-blue-500/30">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              Code <span className="text-blue-600 dark:text-blue-400">Playground</span>
              <Sparkles className="h-5 w-5 text-yellow-500 animate-bounce" />
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
              Experiment with code in a cinematic environment.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative group">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 pr-10 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none transition-all hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {Object.entries(LANGUAGE_CONFIG).map(([id, config]) => (
                  <option key={id} value={id}>
                    {config.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50 shadow-md"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
              {isLoading ? "Running..." : "Execute"}
            </motion.button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-stretch">
          {/* Editor Section */}
          <div className="pg-card group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-500/50 flex flex-col h-[650px]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <span className="ml-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Editor — <span className={LANGUAGE_CONFIG[language].color}>{LANGUAGE_CONFIG[language].name}</span>
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                theme="vs-dark"
                language={
                  language === "cpp"
                    ? "cpp"
                    : language === "csharp"
                      ? "csharp"
                      : language
                }
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="pg-card flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:border-blue-500/50 h-[650px]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Console Output
              </span>
              <button
                onClick={clearOutput}
                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white active:scale-90"
                title="Clear Output"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto bg-white dark:bg-black custom-scrollbar border-t border-slate-200 dark:border-slate-800">
              <pre className="whitespace-pre-wrap text-black dark:text-white leading-relaxed">
                {output || (
                  <span className="text-slate-400 dark:text-slate-600 italic">
                    Ready to run. Write your code and click Execute...
                  </span>
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Instant Execution",
              desc: "Run your code in milliseconds with our optimized backend proxy.",
              icon: <Sparkles className="h-6 w-6 text-blue-500" />,
              color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
            },
            {
              title: "Multi-Language",
              desc: "Supports Python, JS, Java, C++ and C# with full syntax highlighting.",
              icon: <Code2 className="h-6 w-6 text-purple-500" />,
              color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800"
            },
            {
              title: "Zero Setup",
              desc: "No need to install compilers locally. Write and test in your browser.",
              icon: <Terminal className="h-6 w-6 text-emerald-500" />,
              color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-3xl border ${feature.color} transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Section - Mirrored from Home.jsx */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              Codetech<span className="text-blue-600">.</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-slate-500">
              The learning platform for discovering courses, teaching students, and tracking meaningful progress.
            </p>
            <div className="flex gap-3">
              {[Github, Linkedin, Instagram].map((Icon) => (
                <motion.a
                  key={Icon.name}
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
            <div className="flex gap-5"><span className="cursor-pointer hover:text-blue-600">Privacy</span><span className="cursor-pointer hover:text-blue-600">Terms</span><span className="cursor-pointer hover:text-blue-600">Accessibility</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Playground;
