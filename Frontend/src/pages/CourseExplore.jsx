import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Check,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import CourseCard from "../component/CourseCard";
import { Skeleton } from "../components/ui/skeleton";
import api from "../utils/api";

const CourseExplore = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");
  const [term, setTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    setTerm(new URLSearchParams(location.search).get("search") || "");
  }, [location.search]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get("/course");
        setCourses(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Unable to load courses", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const availableCategories = useMemo(
    () => [
      ...new Set(courses.map((course) => course.category).filter(Boolean)),
    ],
    [courses],
  );
  const filtered = useMemo(() => {
    const searchTerm = term.trim().toLowerCase();
    let result = courses.filter((course) => {
      const matchesTerm =
        !searchTerm ||
        [
          course.courseName,
          course.courseDesc,
          course.creator?.name,
          course.category,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchTerm),
        );
      const matchesCategory =
        !categories.length || categories.includes(course.category);
      const matchesLevel = !level || course.courseLevel === level;
      const matchesPrice =
        !price ||
        (price === "under500"
          ? Number(course.coursePrice) < 500
          : price === "500to999"
            ? Number(course.coursePrice) >= 500 &&
              Number(course.coursePrice) <= 999
            : Number(course.coursePrice) >= 1000);
      return matchesTerm && matchesCategory && matchesLevel && matchesPrice;
    });
    if (sort === "priceAsc")
      result = [...result].sort(
        (a, b) => Number(a.coursePrice) - Number(b.coursePrice),
      );
    if (sort === "priceDesc")
      result = [...result].sort(
        (a, b) => Number(b.coursePrice) - Number(a.coursePrice),
      );
    if (sort === "newest")
      result = [...result].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    return result;
  }, [courses, term, categories, level, price, sort]);

  const clearFilters = () => {
    setCategories([]);
    setLevel("");
    setPrice("");
    setSort("");
    setTerm("");
  };
  const toggleCategory = (category) =>
    setCategories((current) =>
      current.includes(category)
        ? current.filter((value) => value !== category)
        : [...current, category],
    );
  const activeFilters =
    categories.length +
    Number(Boolean(level)) +
    Number(Boolean(price)) +
    Number(Boolean(sort));

  return (
    <main className="min-h-screen bg-[#f7f9fd] pb-20 pt-4 dark:bg-slate-950">
      <section className="page-frame py-8 sm:py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-9">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                Course library
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl">
                Find your next skill.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Explore instructor-led courses, build practical knowledge, and
                learn at your own pace.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs font-medium text-slate-500">
                Course library
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                {loading ? "Loading…" : courses.length + " courses"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="group relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search courses, topics, or instructors"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          {availableCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setCategories([])}
                className={
                  !categories.length
                    ? "rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                    : "rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }
              >
                All courses
              </button>
              {availableCategories.slice(0, 7).map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={
                    categories.includes(category)
                      ? "rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-600/25"
                      : "rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300"
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="page-frame py-2">
        <div className="course-explore-layout">
          <FilterPanel
            visible={filtersOpen}
            categories={availableCategories}
            selectedCategories={categories}
            toggleCategory={toggleCategory}
            level={level}
            setLevel={setLevel}
            price={price}
            setPrice={setPrice}
            sort={sort}
            setSort={setSort}
            clearFilters={clearFilters}
            activeFilters={activeFilters}
            matchingCount={filtered.length}
          />
          <section>
            {loading ? (
              <div
                className="course-explore-results"
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-[520px] rounded-3xl" />
                ))}
              </div>
            ) : filtered.length ? (
              <motion.div
                layout
                className="course-explore-results"
              >
                {filtered.map((course, index) => (
                  <motion.div
                    key={course._id}
                    layout
                    className="flex w-full justify-start"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      delay: Math.min(index * 0.04, 0.24),
                    }}
                  >
                    <CourseCard course={course} explorer />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <Filter className="mx-auto h-8 w-8 text-blue-500" />
                  <h2 className="mt-4 text-lg font-semibold">
                    No courses match those filters
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another keyword or clear your filters to see the full
                    library.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700"
                  >
                    Show all courses
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

const FilterPanel = ({
  visible,
  categories,
  selectedCategories,
  toggleCategory,
  level,
  setLevel,
  price,
  setPrice,
  sort,
  setSort,
  clearFilters,
  activeFilters,
  matchingCount,
}) => (
  <aside className="h-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:h-[31rem] sm:rounded-3xl lg:sticky lg:top-24">
    <div className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 dark:border-blue-950/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 sm:px-4 sm:py-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-blue-600 sm:text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Refine
          </p>
          <h2 className="mt-1 text-sm font-semibold sm:text-base">
            Find courses
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {matchingCount} matching course{matchingCount === 1 ? "" : "s"}
          </p>
        </div>
        {activeFilters > 0 && (
          <button
            onClick={clearFilters}
            className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-blue-600 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50 dark:bg-slate-800 dark:ring-blue-900 sm:rounded-xl sm:px-2.5 sm:py-1.5 sm:text-xs"
          >
            Reset
          </button>
        )}
      </div>
      {activeFilters > 0 && (
        <span className="mt-3 hidden rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white sm:inline-flex">
          {activeFilters} active filter{activeFilters > 1 ? "s" : ""}
        </span>
      )}
    </div>
    <div className="space-y-3 p-3 sm:p-4">
      <label className="block text-sm font-semibold">
        Sort by
        <span className="relative mt-2 block">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
          >
            <option value="">Recommended</option>
            <option value="newest">Newest first</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </span>
      </label>
      <fieldset>
        <legend className="text-sm font-semibold">Course level</legend>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {["Beginner", "Medium", "Advance"].map((item) => (
            <button
              key={item}
              onClick={() => setLevel(level === item ? "" : item)}
              className={
                level === item
                  ? "rounded-xl bg-blue-600 px-2 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/25"
                  : "rounded-xl bg-slate-100 px-2 py-2.5 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold">Price range</legend>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            ["under500", "Under ₹500"],
            ["500to999", "₹500 – ₹999"],
            ["1000plus", "₹1,000+"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setPrice(price === value ? "" : value)}
              className={
                price === value
                  ? "flex items-center gap-1 whitespace-nowrap rounded-xl bg-blue-50 px-1.5 py-2 text-left text-[11px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  : "flex items-center gap-1 whitespace-nowrap rounded-xl px-1.5 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              }
            >
              <span
                className={
                  price === value
                    ? "grid h-4 w-4 place-items-center rounded-full border border-blue-600 bg-blue-600 text-white"
                    : "grid h-4 w-4 place-items-center rounded-full border border-slate-300 dark:border-slate-600"
                }
              >
                {price === value && <Check className="h-3 w-3" />}
              </span>
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      {categories.length > 0 && (
        <fieldset className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <legend className="text-sm font-semibold">Categories</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              >
                {category}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  </aside>
);

export default CourseExplore;
