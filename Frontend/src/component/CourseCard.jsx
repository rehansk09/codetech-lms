import React from "react";
import { Clock3, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import CourseActions from "./CourseActions";

const CourseCard = ({ course, compact = false, wide = false, explorer = false }) => {
  const description = course?.courseDesc
    ? course.courseDesc.length > 105
      ? `${course.courseDesc.slice(0, 105)}…`
      : course.courseDesc
    : "Explore this course and its curriculum.";
  const enrolled = Array.isArray(course?.enrolledUsers) ? course.enrolledUsers.length : 0;

  return (
    <article style={explorer ? { width: "min(25rem, 100%)", minWidth: 0 } : undefined} className={(explorer ? "max-w-none " : wide ? "max-w-[34rem] " : "max-w-[30rem] ") + "group justify-self-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8 dark:border-slate-800 dark:bg-slate-900"}>
      <Link to={`/course-detail/${course?._id}`} className="block">
        <div className={compact || explorer ? "relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800" : "relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"}>
          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={course?.coursePic?.url} alt={course?.courseName || "Course"} />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/55 to-transparent" />
          <span className={compact ? "absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 backdrop-blur dark:bg-slate-950/80 dark:text-slate-200" : "absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur dark:bg-slate-950/80 dark:text-slate-200"}>
            {course?.courseLevel || "Course"}
          </span>
        </div>
        <div className={compact ? "p-3" : "p-5"}>
          <p className={compact ? "text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400" : "text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400"}>{course?.category || "Learning"}</p>
          <h2 className={compact ? "mt-1.5 line-clamp-2 min-h-10 text-sm font-semibold leading-5 tracking-tight text-slate-950 dark:text-white" : "mt-2 line-clamp-2 min-h-12 text-lg font-semibold leading-6 tracking-tight text-slate-950 dark:text-white"}>{course?.courseName}</h2>
          <p className={compact ? "mt-1.5 line-clamp-2 min-h-8 text-xs leading-4 text-slate-500 dark:text-slate-400" : "mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400"}>{description}</p>
          <p className={compact ? "mt-3 text-xs font-medium text-slate-700 dark:text-slate-200" : "mt-4 text-sm font-medium text-slate-700 dark:text-slate-200"}>{course?.creator?.name || "Codetech instructor"}</p>
          <div className={compact ? "mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500 dark:border-slate-800" : "mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800"}>
            <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{course?.courseDuration || "Self paced"}</span>
            <span className="flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5" />{enrolled} enrolled</span>
          </div>
          <p className={compact ? "mt-3 text-lg font-semibold text-slate-950 dark:text-white" : "mt-4 text-xl font-semibold text-slate-950 dark:text-white"}>₹{Number(course?.coursePrice || 0).toLocaleString("en-IN")}</p>
        </div>
      </Link>
      <div className={compact ? "border-t border-slate-100 px-3 py-2 dark:border-slate-800" : "border-t border-slate-100 px-5 py-3 dark:border-slate-800"}><CourseActions courseId={course?._id} /></div>
    </article>
  );
};

export default CourseCard;
