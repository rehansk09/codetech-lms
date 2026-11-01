import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Grid2X2,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import NotificationBell from "./NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import InstallAppButton from "./InstallAppButton";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target))
        setProfileOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    window.addEventListener("profile-updated", refreshUser);
    window.addEventListener("auth-changed", refreshUser);
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("profile-updated", refreshUser);
      window.removeEventListener("auth-changed", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user/logout`,
        { method: "POST", credentials: "include" },
      );
    } catch (error) {
      console.error("Logout request failed", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };
  const dashboard = () =>
    navigate(
      user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "instructor"
          ? "/instructor/dashboard"
          : "/user/dashboard",
    );
  const closeMobile = () => setMobileOpen(false);
  const comingSoon = "Coming soon — this area is being designed.";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/30 bg-white/55 shadow-[0_8px_30px_rgb(15_23_42/0.04)] backdrop-blur-2xl dark:border-white/5 dark:bg-slate-950/55 dark:shadow-black/10">
      <nav
        className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center px-4 sm:h-[4.5rem] sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex min-w-0 items-center">
          <Link
            to="/"
            className="font-bold tracking-tight text-slate-950 dark:text-white"
            onClick={closeMobile}
          >
            <span className="text-xl">
              <span className="text-blue-800 dark:text-blue-400">C</span>odetech
              <span className="text-blue-800 dark:text-blue-400">.</span>
            </span>
          </Link>
        </div>
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Pricing
          </Link>
          <Link
            to="/playground"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Playground
          </Link>
        </div>
        <div className="hidden items-center justify-end gap-2 md:flex">
          <InstallAppButton />
          <DarkModeToggle />
          {user ? (
            <>
              <NotificationBell userId={user._id} />
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-1.5 rounded-xl p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Open account menu"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-800">
                    <AvatarImage src={user.photoUrl} alt="" />
                    <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
                    >
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <Avatar>
                          <AvatarImage src={user.photoUrl} alt="" />
                          <AvatarFallback className="bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user.email || "Account"}
                          </p>
                          <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {user.role || "student"}
                          </span>
                        </div>
                      </div>
                      <button
                        role="menuitem"
                        onClick={dashboard}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Grid2X2 className="h-4 w-4" />
                        Dashboard
                      </button>
                      {["student", "instructor"].includes(user.role) && (
                        <button
                          role="menuitem"
                          onClick={() => navigate("/profile")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <UserRound className="h-4 w-4" />
                          Edit profile
                        </button>
                      )}
                      <button
                        role="menuitem"
                        onClick={() => navigate("/courseexplore")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <BookOpen className="h-4 w-4" />
                        Explore courses
                      </button>
                      <button
                        role="menuitem"
                        onClick={logout}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
              >
                Create account
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                to="/"
                onClick={closeMobile}
                className="rounded-xl px-3 py-2.5 font-medium"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                onClick={closeMobile}
                className="rounded-xl px-3 py-2.5 font-medium"
              >
                Pricing
              </Link>
              <Link
                to="/playground"
                onClick={closeMobile}
                className="rounded-xl px-3 py-2.5 font-medium"
              >
                Playground
              </Link>
              <Link
                to="/courseexplore"
                onClick={closeMobile}
                className="rounded-xl px-3 py-2.5 font-medium"
              >
                Explore courses
              </Link>
              <div className="mt-2 flex items-center justify-between border-t pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <InstallAppButton mobile />
                  <DarkModeToggle />
                </div>
                {user ? (
                  <div className="flex items-center gap-1">
                    <NotificationBell userId={user._id} />
                    <button
                      onClick={() => {
                        closeMobile();
                        dashboard();
                      }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={logout}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      onClick={closeMobile}
                      to="/login"
                      className="rounded-xl px-3 py-2 text-sm font-semibold"
                    >
                      Sign in
                    </Link>
                    <Link
                      onClick={closeMobile}
                      to="/register"
                      className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
