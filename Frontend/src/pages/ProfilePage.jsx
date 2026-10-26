import React, { useEffect, useState } from "react";
import { Save, UserRound, Wrench } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";

const emptyProfile = { name: "", email: "", role: "", address: "", mobileNumber: "", techStack: "", bio: "" };

const ProfilePage = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/user/profile");
        const user = data.user;
        setProfile({ ...emptyProfile, ...user, techStack: (user.techStack || []).join(", ") });
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const update = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("/user/profile", profile);
      const nextUser = { ...JSON.parse(localStorage.getItem("user") || "{}"), ...data.user };
      localStorage.setItem("user", JSON.stringify(nextUser));
      window.dispatchEvent(new Event("profile-updated"));
      toast.success(data.message);
      setProfile({ ...emptyProfile, ...data.user, techStack: (data.user.techStack || []).join(", ") });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="grid min-h-[55vh] place-items-center text-sm text-slate-500">Loading profile…</div>;

  return (
    <main className="page-frame max-w-5xl py-10 sm:py-14">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="eyebrow">Account settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Edit your profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep your details current so your learning and teaching space feels personal.</p>
      </header>

      <form onSubmit={saveProfile} className="mt-7 grid gap-7 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">{profile.name?.slice(0, 1).toUpperCase() || "U"}</div>
          <p className="mt-4 text-lg font-semibold">{profile.name || "Your profile"}</p>
          <p className="mt-1 break-all text-xs text-slate-500">{profile.email}</p>
          <span className="mt-4 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">{profile.role}</span>
        </aside>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-center gap-2"><UserRound className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold">Personal details</h2></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><input required name="name" value={profile.name} onChange={update} className="input" placeholder="Your full name" /></Field>
              <Field label="Email address"><input value={profile.email} disabled className="input cursor-not-allowed opacity-60" /></Field>
              <Field label="Mobile number"><input name="mobileNumber" value={profile.mobileNumber} onChange={update} className="input" placeholder="e.g. +91 98765 43210" /></Field>
              <Field label="Address"><input name="address" value={profile.address} onChange={update} className="input" placeholder="City, state, country" /></Field>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-center gap-2"><Wrench className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold">About your work</h2></div>
            <Field label="Tech stack / interests" hint="Separate skills with commas"><input name="techStack" value={profile.techStack} onChange={update} className="input" placeholder="React, Node.js, Python" /></Field>
            <Field label="Bio" hint="Tell learners or instructors a little about yourself"><textarea name="bio" value={profile.bio} onChange={update} rows="5" className="input resize-y" placeholder="Write a short introduction…" /></Field>
          </section>

          <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto"><Save className="h-4 w-4" />{saving ? "Saving profile…" : "Save changes"}</button>
        </div>
      </form>
    </main>
  );
};

const Field = ({ label, hint, children }) => <label className="mt-5 block text-sm font-semibold">{label}{hint && <span className="ml-2 font-normal text-slate-500">{hint}</span>}<div className="mt-2">{children}</div></label>;

export default ProfilePage;
