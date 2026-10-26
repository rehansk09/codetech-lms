import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Lock, PlayCircle, ShieldCheck, UsersRound } from "lucide-react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import CourseActions from "@/component/CourseActions";
import Spinner from "../component/Spinner";
import api from "../utils/api";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await api.get("/lecture/" + courseId);
        setDetails(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this course.");
      }
    };
    loadCourse();
  }, [courseId]);

  const lessons = useMemo(
    () => details?.lectures?.flatMap((lecture) => lecture.lessons || []) || [],
    [details]
  );

  if (error) {
    return <main className="page-frame grid min-h-[60vh] place-items-center"><div className="text-center"><p className="text-lg font-semibold">{error}</p><Link to="/courseexplore" className="mt-4 inline-block text-sm font-semibold text-blue-600">Browse courses</Link></div></main>;
  }
  if (!details) return <Spinner />;

  const { course, instructor } = details;
  const firstLesson = lessons[0];
  const enrolled = Array.isArray(course.enrolledUsers) ? course.enrolledUsers.length : 0;

  return (
    <main className="min-h-screen bg-[#f7f9fd] dark:bg-slate-950">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[34rem] border-b border-slate-800 bg-slate-950" />
        <div className="page-frame relative grid gap-7 md:grid-cols-[minmax(0,1fr)_24rem] md:items-start">
          <section className="py-12 text-white sm:py-16 lg:py-20">
          <Link to="/courseexplore" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white">← Back to explore</Link>
          <div className="mt-9 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">{course.category || "Professional learning"}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">{course.courseName}</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{course.courseDesc}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-blue-300" />{enrolled} enrolled</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-300" />{course.courseDuration || "Self paced"}</span>
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-300" />Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-6 text-sm text-slate-300">Created by <span className="font-semibold text-white">{instructor?.name || course.creator?.name || "Codetech instructor"}</span></p>
          </div>
          </section>

          <aside className="md:col-start-2 md:row-span-2 md:row-start-1 md:pt-10">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl shadow-slate-950/30 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                {firstLesson?.video_URL ? <ReactPlayer width="100%" height="100%" url={firstLesson.video_URL} controls /> : <img src={course.coursePic?.url} alt={course.courseName} className="h-full w-full object-cover" />}
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">{course.courseLevel || "Course"}</p>
                <div className="mt-2 flex items-center justify-between gap-3"><h2 className="text-2xl font-semibold">{String.fromCharCode(8377)}{Number(course.coursePrice || 0).toLocaleString("en-IN")}</h2><span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><ShieldCheck className="h-4 w-4" />Secure checkout</span></div>
                <p className="mt-3 text-sm leading-6 text-slate-500">One-time enrollment. Learn at your pace and resume anytime.</p>
                <div className="mt-5"><CourseActions courseId={courseId} /></div>
              </div>
            </div>
          </aside>

          <div className="max-w-4xl space-y-6 pb-16 pt-10 md:col-start-1 md:row-start-2 md:pt-12">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <p className="eyebrow">What you will learn</p>
            <h2 className="mt-2 text-2xl font-semibold">Course overview</h2>
            <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{course.courseDesc}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div><p className="eyebrow">Curriculum</p><h2 className="mt-2 text-2xl font-semibold">Course content</h2></div>
              <p className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{lessons.length} lessons</p>
            </div>
            <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
              {lessons.length ? lessons.map((lesson, index) => (
                <div key={lesson._id || index} className="flex items-center gap-3 py-4">
                  <span className={lesson.isPreview ? "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300" : "grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800"}>
                    {lesson.isPreview ? <PlayCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{lesson.title}</p><p className="mt-0.5 text-xs text-slate-500">{lesson.isPreview ? "Preview available" : "Included with enrollment"}</p></div>
                  {lesson.isPreview && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                </div>
              )) : <p className="py-8 text-center text-sm text-slate-500">Curriculum will appear once lessons are published.</p>}
            </div>
          </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;
