import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  ListVideo,
  PlayCircle,
  Sparkles,
  Video,
} from "lucide-react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import api from "../utils/api";
import Spinner from "../component/Spinner";

const LecturePage = () => {
  const { courseId } = useParams();
  const [details, setDetails] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const passed = localStorage.getItem(`quiz_passed_${courseId}`) === "true";

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/lecture/${courseId}`);
        setDetails(data);
        const first =
          data.playingLecture?.lessons?.[0] ||
          data.lectures?.flatMap((lecture) => lecture.lessons || [])[0];
        setSelected(first || null);
      } catch (error) {
        alert(error.response?.data?.message || "Unable to load this course.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const lessons = useMemo(
    () => details?.lectures?.flatMap((lecture) => lecture.lessons || []) || [],
    [details],
  );
  const current = Math.max(
    0,
    lessons.findIndex((lesson) => lesson._id === selected?._id),
  );
  const lessonNumber = lessons.length ? current + 1 : 0;
  const progress = lessons.length
    ? Math.round((lessonNumber / lessons.length) * 100)
    : 0;

  const requestMeeting = async () => {
    try {
      setRequesting(true);
      await api.post("/api/notifications/meeting-request", { courseId });
      alert(
        "Meeting request sent. Your instructor will reply in Notifications.",
      );
    } catch (error) {
      alert(error.response?.data?.message || "Unable to request a meeting.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <Spinner />;
  const course = details?.course;

  return (
    <main className="min-h-screen bg-[#030817] text-slate-100">
      <div className="mx-auto flex max-w-[1500px] flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section
          className="mt-6 relative overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-gradient-to-br from-[#101a35] via-[#091227] to-[#060c1b] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)] sm:p-7"
          style={{ order: 2 }}
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-center">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">
                <Sparkles className="h-3.5 w-3.5" /> Your learning space
              </div>
              <h1 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {course?.courseName || "Course"}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Led by {course?.creator?.name || "your Codetech instructor"}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  to={`/course/${courseId}/quiztest`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-950/25 px-3.5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-blue-400/60 hover:bg-slate-800"
                >
                  <BookOpen className="h-4 w-4 text-blue-300" /> Take quiz
                </Link>
                {passed && (
                  <Link
                    to={`/certificate/${user?._id}/${courseId}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                  >
                    <GraduationCap className="h-4 w-4" /> View certificate
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full p-1"
                  style={{
                    background: `conic-gradient(#60a5fa ${progress}%, #1e293b 0)`,
                  }}
                >
                  <div className="grid h-full w-full place-items-center rounded-full bg-[#0a1327]">
                    <span className="text-sm font-bold text-white">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">
                    Your progress
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Lesson {lessonNumber}{" "}
                    <span className="text-sm font-medium text-slate-500">
                      of {lessons.length}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Keep the momentum going.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-slate-800 bg-[#071022]/80 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                      Continue with
                    </p>
                    <p className="truncate text-sm font-semibold text-white">
                      {selected?.title || "Select a lesson"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          className="course-progress-workspace items-start"
          style={{ order: 1 }}
        >
          <section className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-black shadow-2xl shadow-black/30">
              <div className="aspect-video bg-[#071022]">
                {selected?.video_URL ? (
                  <ReactPlayer
                    url={selected.video_URL}
                    width="100%"
                    height="100%"
                    controls
                  />
                ) : (
                  <div className="grid h-full place-items-center px-6 text-center">
                    <div>
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-800 text-blue-300">
                        <PlayCircle className="h-6 w-6" />
                      </span>
                      <p className="mt-3 text-sm font-medium text-slate-300">
                        Select a lesson to begin.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-sm text-slate-400">
                Use the lesson list to continue where you left off.
              </p>
              <div className="flex gap-2">
                <button
                  disabled={current <= 0}
                  onClick={() => setSelected(lessons[current - 1])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  disabled={current >= lessons.length - 1}
                  onClick={() => setSelected(lessons[current + 1])}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-blue-400/20 bg-gradient-to-r from-blue-600/25 via-[#101d42] to-[#0c1730] p-5 shadow-xl shadow-blue-950/20 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-400/15 text-blue-200">
                  <Video className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
                    Instructor support
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Need help with this course?
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Request a one-to-one meeting with your instructor.
                  </p>
                </div>
              </div>
              <button
                disabled={requesting}
                onClick={requestMeeting}
                className="relative mt-6 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-black/15 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-8 sm:mt-3 sm:w-auto"
              >
                <Video className="h-4 w-4" />
                {requesting ? "Sending..." : "Request a meeting"}
              </button>
            </div>
          </section>

          <aside className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10 md:sticky md:top-6">
            <div className="border-b border-slate-800 bg-gradient-to-br from-blue-500/10 to-transparent p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                    <ListVideo className="h-3.5 w-3.5" /> Course content
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-white">
                    {selected?.title || "Your course plan"}
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-950/50 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {lessonNumber}/{lessons.length}
                </span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready to learn
                </span>
              </div>
            </div>
            <div className="max-h-[65vh] space-y-1.5 overflow-y-auto p-2.5">
              {lessons.length ? (
                lessons.map((lesson, index) => {
                  const active = selected?._id === lesson._id;
                  return (
                    <button
                      key={lesson._id || index}
                      onClick={() => setSelected(lesson)}
                      className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40" : "text-slate-300 hover:bg-slate-800/90"}`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? "bg-white/15" : "bg-slate-800 text-slate-400 group-hover:text-blue-300"}`}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[11px] font-medium ${active ? "text-blue-100" : "text-slate-500"}`}
                        >
                          Lesson {index + 1}
                        </span>
                        <span className="block truncate text-sm font-semibold">
                          {lesson.title}
                        </span>
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition ${active ? "text-white" : "text-slate-600 group-hover:translate-x-0.5 group-hover:text-blue-300"}`}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center">
                  <ListVideo className="mx-auto h-7 w-7 text-slate-600" />
                  <p className="mt-3 text-sm text-slate-400">
                    No lessons are available yet.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default LecturePage;
