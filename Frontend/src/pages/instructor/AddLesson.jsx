import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Spinner from "../../component/Spinner";
import api from "../../utils/api";

const AddLesson = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [lectures, setLectures] = useState([]);
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lecture/${courseId}`);
      setLectures(response?.data?.lectures || []);
    } catch (error) {
      console.log("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert("Please provide all required fields.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("isPreview", isPreview);

    try {
      const response = await api.post(
        `/course/${courseId}/add_lessons`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      fetchLessons();

      setTitle("");
      setFile(null);
      setIsPreview(false);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lectureId, lessonId) => {
    try {
      const response = await api.delete(`/lecture/delete-lesson/${lectureId}/${lessonId}`);
      if (response.status === 200) {
        alert("Lesson deleted successfully!");
        fetchLessons();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete the lesson.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {saving && <Spinner />}
      <div className="surface rounded-3xl p-6 sm:p-8">
        <p className="eyebrow">Curriculum builder</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Add a lesson</h2><p className="mt-2 text-sm text-slate-500">Upload course video and decide whether learners can preview it.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-2">Title</Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-2">Video</Label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950"
            />
            {file && <p className="text-sm text-green-600 mt-2">Selected file: {file.name}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              className="toggle"
            />
            <label className="ml-2">Is this video FREE?</label>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={saving} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70 sm:w-auto">
              {saving ? "Saving lesson…" : "Save Lesson"}
            </button>
            <button
              onClick={() => {
                setTitle("");
                setFile(null);
                setIsPreview(false);
                document.querySelector('input[type="file"]').value = "";
              }}
              type="reset"
              className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 sm:w-auto"
            >
              Reset
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-xl font-bold mt-6">Lectures</h3>
          {loading ? (
            <Spinner />
          ) :  lectures.length === 0 ? (
            <p className="text-center text-gray-600">No lectures found. Start by adding a lesson.</p>
          ) : (
            lectures.map((lecture) => (
              <div key={lecture._id} className="mb-6">
                <h4 className="text-lg font-semibold">
                  {lecture?.course?.courseName || "Course Name Not Found"}
                </h4>
                <ul>
                  {lecture.lessons.map((lesson) => (
                    <li key={lesson?.id} className="flex flex-col gap-4 border p-4 rounded-2xl sm:flex-row sm:items-start sm:justify-between">
                      <div className="w-full">
                        <h5 className="font-bold">{lesson?.title || "Untitled Lesson"}</h5>
                        <div className="mt-3 aspect-video w-full max-w-2xl overflow-hidden rounded-xl bg-slate-950">
                          <ReactPlayer url={lesson?.video_URL} controls width="100%" height="auto" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lecture._id, lesson.id)}
                        className="w-full rounded-xl bg-red-500 px-4 py-2 text-white sm:mt-0 sm:w-auto"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
