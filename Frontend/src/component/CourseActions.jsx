// CourseActions Component (Handles checking purchase status)
import React, { useState, useEffect } from "react";
import api from "../utils/api";
import BuyCourseButton from "./BuyCourseButton"; 

const CourseActions = ({ courseId }) => {
  const [purchased, setPurchased] = useState(false);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();
  const canEnroll = user?.role === "student";

  // Check purchase status on component mount
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!canEnroll) return;
      try {
        const response = await api.post("/api/payments/status", { courseId });

        if (response.data.success) {
          setPurchased(response.data.purchased);
        }
      } catch (error) {
        console.error("Error checking purchase status:", error);
      }
    };

    checkPurchaseStatus();
  }, [courseId, canEnroll]);

  const handleContinueCourse = () => {
    window.location.href = `/course-progress/${courseId}`;
  };

  return (
    <div className="w-full">
      {user && !canEnroll ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {user.role === "instructor" ? "Instructor accounts cannot enroll in courses." : "Administrator accounts cannot enroll in courses."}
        </p>
      ) : purchased ? (
        <button onClick={handleContinueCourse} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          Continue Course
        </button>
      ) : (
        <BuyCourseButton courseId={courseId} />
      )}
    </div>
  );
};

export default CourseActions;
