import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import authVisual from "../assets/auth-signin-v2.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/user/login", formData);
      toast.success(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));
      navigate(
        data.user.role === "admin"
          ? "/admin/dashboard"
          : data.user.role === "instructor"
            ? "/instructor/dashboard"
            : "/user/dashboard",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (error.request
            ? "No response from server. Please check your connection."
            : "Login failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };
  if (user) return <Navigate to="/" />;
  return (
    <main className="grid min-h-screen bg-slate-50 p-4 pt-20 dark:bg-slate-950 lg:place-items-center lg:p-8">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/50 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.05fr_.95fr]">
        <aside className="relative hidden min-h-[680px] overflow-hidden lg:block">
          <img
            src={authVisual}
            alt="Learner working at a laptop"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Learn with focus
            </span>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight">
              Your next learning milestone starts here.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-200">
              Pick up the courses, assessments, and conversations that move you
              forward.
            </p>
          </div>
        </aside>
        <div className="flex min-h-[600px] items-center p-6 sm:p-12">
          <form className="mx-auto w-full max-w-sm" onSubmit={submit}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white">
                C
              </span>
              Codetech
            </Link>
            <p className="eyebrow mt-10">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Sign in to continue.
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Use the account you created for your learning space.
            </p>
            <label className="mt-8 block text-sm font-semibold">
              Email address
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  autoComplete="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </label>
            <label className="mt-5 block text-sm font-semibold">
              Password
              <div className="relative mt-2">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
            <button
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="mt-6 text-center text-sm text-slate-500">
              New to Codetech?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};
export default Login;
