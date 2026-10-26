import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormItem } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import api from "../../utils/api";
import Spinner from "../../component/Spinner";

const AddCoursePage = () => {

   const instructorId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;

  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseLevel: "Beginner",
    coursePrice: "",
    creator: instructorId,
    category: "",
    courseDuration: "",
    courseDesc: "",
    file: "",
    id: null,
  });

  const [coursePicPreview, setCoursePicPreview] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading spinner

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: value });
  };

  const handleCoursePicChange = (e) => {
    const file = e.target.files[0];
    setCourseForm({ ...courseForm, file: file });
    if (file) {
      setTimeout(() => {
        setCoursePicPreview(URL.createObjectURL(file));
      }, 1000);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(courseForm).forEach((key) => {
      if (key !== "id") {
        formData.append(key, courseForm[key]);
      }
    });

    setLoading(true); // Set loading to true when submitting the form

    try {
      const response = await api.post("/course/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      setCourseForm({ ...courseForm, id: response.data.courseId });
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Failed to add course."}`);
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {loading && <Spinner />}
      <div className="mb-8 flex items-end justify-between">
        <div><p className="eyebrow">Creator studio</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Create a course</h1><p className="mt-2 text-sm text-slate-500">Set the essentials first. You can add lessons after publishing.</p></div>
        {courseForm.id && (
          <Link to={`/instructor/course/${courseForm.id}/add_lessons`} className="">
            Add Lesson
          </Link>
        )}
      </div>
      <form onSubmit={handleCourseSubmit} className="surface grid gap-6 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
        <FormItem className="sm:col-span-2">
          <Label>Course Name</Label>
          <Input
            name="courseName"
            value={courseForm.courseName}
            onChange={handleCourseChange}
            required
          />
        </FormItem>
        <FormItem>
          <Label>Course Level</Label>
          <select
            name="courseLevel"
            value={courseForm.courseLevel}
            onChange={handleCourseChange}
            required
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="Beginner">Beginner</option>
            <option value="Medium">Medium</option>
            <option value="Advance">Advance</option>
          </select>
        </FormItem>
        <FormItem>
          <Label>Course Price</Label>
          <Input
            name="coursePrice"
            type="number"
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={courseForm.coursePrice}
            onChange={handleCourseChange}
          />
        </FormItem>
        <FormItem>
          <Label>Category</Label>
          <select
            name="category"
            value={courseForm.category}
            onChange={handleCourseChange}
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="Data Science">Data Science</option>
            <option value="Next JS">Next JS</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Fullstack Development">Fullstack Development</option>
            <option value="MERN Stack Development">MERN Stack Development</option>
            <option value="Javascript">Javascript</option>
            <option value="Python">Python</option>
            <option value="Docker">Docker</option>
            <option value="MongoDB">MongoDB</option>
            <option value="HTML">HTML</option>
          </select>
        </FormItem>
        <FormItem>
          <Label>Course Duration</Label>
          <Input
            name="courseDuration"
             className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={courseForm.courseDuration}
            onChange={handleCourseChange}
            required
          />
        </FormItem>
        <FormItem className="sm:col-span-2">
          <Label>Course Description</Label>
          <Textarea
            name="courseDesc"
             className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={courseForm.courseDesc}
            onChange={handleCourseChange}
            required
          />
        </FormItem>
        <FormItem className="sm:col-span-2">
          <Label>Course Image</Label>
          <Input type="file" onChange={handleCoursePicChange} required className="mt-2 rounded-xl border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950" />
          {coursePicPreview && (
            <img
              src={coursePicPreview}
              alt="Course Preview"
              className="mt-4 h-48 w-full rounded-2xl object-cover sm:w-72"
            />
          )}
        </FormItem>
        <div className="sm:col-span-2"><Button type="submit" disabled={loading} className="mt-2 disabled:cursor-wait disabled:opacity-70">{loading ? "Publishing course…" : "Publish course"}</Button></div>
      </form>
    </div>
  );
};

export default AddCoursePage;
