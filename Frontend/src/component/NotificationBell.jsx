import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarClock, CheckCircle2, Inbox, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const relativeTime = (value) => {
  if (!value) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const fetchNotifications = async () => { try { const { data } = await api.get("/api/notifications"); setNotifications(data.filter((item) => !( ["meeting_request", "meeting_scheduled"].includes(item.type) && (item.status === "completed" || item.meetingId?.status === "completed") ))); } catch (error) { console.error("Unable to fetch notifications", error); } };

  useEffect(() => {
    fetchNotifications(); const interval = setInterval(fetchNotifications, 20000);
    const onOutside = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false); };
    const onEscape = (event) => { if (event.key === "Escape") { setOpen(false); setSelectedRequest(null); } };
    document.addEventListener("mousedown", onOutside); document.addEventListener("keydown", onEscape);
    return () => { clearInterval(interval); document.removeEventListener("mousedown", onOutside); document.removeEventListener("keydown", onEscape); };
  }, [userId]);

  const activeNotifications = notifications.filter((item) => !(["meeting_request", "meeting_scheduled"].includes(item.type) && (item.status === "completed" || item.meetingId?.status === "completed")));
  const unreadCount = activeNotifications.filter((item) => !item.isRead && String(item.receiverId?._id || item.receiverId) === String(userId)).length;
  const scheduleMeeting = async () => {
    if (!meetingTitle.trim() || !meetingTime) return alert("Enter a meeting title and future time.");
    try { setSaving(true); await api.post("/api/meetings/from-request", { requestId: selectedRequest._id, meetingTitle, meetingTime }); setSelectedRequest(null); setMeetingTitle(""); setMeetingTime(""); await fetchNotifications(); alert("Meeting scheduled. The student has received the join link."); }
    catch (error) { alert(error.response?.data?.message || "Unable to schedule the meeting."); }
    finally { setSaving(false); }
  };

  return <div className="relative" ref={ref}>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Open notifications" aria-expanded={open} className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"><Bell className="h-[19px] w-[19px]" />{unreadCount > 0 && <span className="absolute right-1 top-1 min-w-4 rounded-full bg-blue-600 px-1 text-[10px] font-bold leading-4 text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>
    <AnimatePresence>{open && <motion.section initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute right-0 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-slate-800"><div><h2 className="text-sm font-semibold text-slate-950 dark:text-white">Notifications</h2><p className="text-xs text-slate-500 dark:text-slate-400">Meeting requests and updates</p></div>{unreadCount > 0 && <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">{unreadCount} new</span>}</header>
      <div className="max-h-96 overflow-y-auto p-2">{notifications.length === 0 ? <div className="grid min-h-52 place-items-center px-6 text-center"><div><span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800"><Inbox className="h-5 w-5" /></span><p className="text-sm font-medium">You’re all caught up</p><p className="mt-1 text-xs text-slate-500">New meeting activity will appear here.</p></div></div> : notifications.map((item) => {
        const isInstructorRequest = user?.role === "instructor" && item.type === "meeting_request" && item.status === "pending" && String(item.receiverId?._id || item.receiverId) === String(userId);
        const isStudentMeeting = user?.role === "student" && item.type === "meeting_scheduled" && item.meetingId;
        const Icon = isStudentMeeting ? Video : isInstructorRequest ? CalendarClock : CheckCircle2;
        return <article key={item._id} className={`rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/70 ${!item.isRead ? "bg-blue-50/60 dark:bg-blue-950/20" : ""}`}><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium leading-5 text-slate-800 dark:text-slate-100">{item.message}</p><time className="shrink-0 text-[11px] text-slate-400">{relativeTime(item.createdAt)}</time></div>{item.courseId?.courseName && <p className="mt-1 text-xs text-slate-500">{item.courseId.courseName}</p>}{item.meetingId?.meetingTime && <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">{new Date(item.meetingId.meetingTime).toLocaleString()}</p>}{isInstructorRequest && <button onClick={() => setSelectedRequest(item)} className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Schedule & send link</button>}{isStudentMeeting && <button onClick={() => { setOpen(false); navigate(`/meeting/${item.meetingId._id}`); }} className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Open meeting</button>}</div></div></article>;
      })}</div>
    </motion.section>}</AnimatePresence>
    <AnimatePresence>{selectedRequest && <motion.div role="dialog" aria-modal="true" aria-label="Schedule meeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"><p className="eyebrow">Instructor action</p><h2 className="mt-1 text-lg font-semibold">Schedule one-to-one meeting</h2><p className="mt-1 text-sm text-slate-500">The student will receive a protected join link.</p><label className="mt-5 block text-sm font-medium">Meeting title<input className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} /></label><label className="mt-3 block text-sm font-medium">Start time<input className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" type="datetime-local" value={meetingTime} onChange={(event) => setMeetingTime(event.target.value)} /></label><div className="mt-5 flex justify-end gap-2"><button onClick={() => setSelectedRequest(null)} className="rounded-xl px-3 py-2 text-sm font-semibold">Cancel</button><button disabled={saving} onClick={scheduleMeeting} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Scheduling..." : "Schedule meeting"}</button></div></motion.div></motion.div>}</AnimatePresence>
  </div>;
};

export default NotificationBell;
