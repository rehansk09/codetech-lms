import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";
import CourseCard from "../component/CourseCard"; 
import api from "../utils/api";
import { Link } from "react-router-dom";

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden flex flex-col w-full">
      <Skeleton className="w-full h-40" />
      <div className="px-5 py-4 space-y-3 flex-1 flex flex-col justify-between">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

const Course = () => {
  const [allcourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/course");
      console.log(response.data);
      const courses = response.data.data;

      if (Array.isArray(courses)) {
        setAllCourses(courses);
      } else {
        console.error("Courses data is not an array:", courses);
        setAllCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="bg-slate-50 py-14 dark:bg-slate-950 sm:py-20">
      <div className="page-frame max-w-[88rem] py-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="eyebrow">Keep exploring</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Featured courses</h2></div>
          <Link
            to="/courseexplore"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <CourseSkeleton key={index} />)
            : allcourses.map((course) => (
                <CourseCard course={course} key={course._id} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Course;
