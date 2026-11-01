import { useEffect, useState } from "react";
import { BookOpen, Check, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import authVisual from "../assets/auth-register-v2.png";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
};

const Register = () => {
  const user = getStoredUser();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminRegistrationOpen, setAdminRegistrationOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { api.get("/user/registration-options").then(({ data }) => setAdminRegistrationOpen(Boolean(data.adminRegistrationOpen))).catch(() => setAdminRegistrationOpen(false)); }, []);
  const submit = async (event) => { event.preventDefault(); setLoading(true); try { const { data } = await api.post("/user/register", formData); toast.success(data.message); navigate("/login"); } catch (error) { toast.error(error.response?.data?.message || "Registration failed"); } finally { setLoading(false); } };
  if (user) return <Navigate to="/" />;
  const update = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  return <main className="grid min-h-screen bg-slate-50 p-4 pt-20 dark:bg-slate-950 lg:place-items-center lg:p-8"><section className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/50 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[.95fr_1.05fr]"><div className="flex min-h-[650px] items-center p-6 sm:p-10"><form className="mx-auto w-full max-w-md" onSubmit={submit}><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white">C</span>Codetech</Link><p className="eyebrow mt-8">Build your learning space</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account.</h1><p className="mt-2 text-sm text-slate-500">Choose how you’ll use Codetech, then get started.</p>
    <div className="mt-6 grid grid-cols-2 gap-3">{[["admin", "Admin", ShieldCheck, adminRegistrationOpen ? "Set up platform control" : "Admin account already claimed", !adminRegistrationOpen], ["student", "Student", BookOpen, "Learn at your pace", false], ["instructor", "Instructor", GraduationCap, "Create and teach", false]].map(([value, label, Icon, detail, disabled]) => <button key={value} type="button" disabled={disabled} onClick={() => setFormData({ ...formData, role: value })} className={`relative rounded-2xl border p-3 text-left transition ${disabled ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-55 dark:border-slate-800 dark:bg-slate-950" : formData.role === value ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950/40 dark:ring-blue-950" : "border-slate-200 hover:border-blue-200 dark:border-slate-700"}`}><Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" /><p className="mt-2 text-sm font-semibold">{label}</p><p className="text-xs text-slate-500">{detail}</p>{formData.role === value && <Check className="absolute right-3 top-3 h-4 w-4 text-blue-600" />}</button>)}</div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Your name<div className="relative mt-2"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required autoComplete="name" name="name" value={formData.name} onChange={update} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Your name" /></div></label><label className="block text-sm font-semibold">Email<div className="relative mt-2"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required autoComplete="email" type="email" name="email" value={formData.email} onChange={update} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="you@example.com" /></div></label></div>
    <label className="mt-4 block text-sm font-semibold">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required autoComplete="new-password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={update} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Create a secure password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
    <button disabled={loading || !formData.role} className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button><p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600">Sign in</Link></p>
  </form></div><aside className="relative hidden min-h-[650px] overflow-hidden lg:block"><img src={authVisual} alt="Course creator planning a lesson" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" /><div className="absolute bottom-10 left-10 right-10 text-white"><span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">A space made for momentum</span><h2 className="mt-4 text-4xl font-semibold tracking-tight">Teach, learn, and grow with clarity.</h2></div></aside></section></main>;
};
export default Register;
