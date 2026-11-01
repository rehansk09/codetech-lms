import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMeetings = async () => {
    try {
      const { data } = await api.get("/api/meetings/instructor");
      setMeetings(data);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to fetch meetings.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMeetings();
  }, []);
  const complete = async (id) => {
    try {
      await api.put(`/api/meetings/${id}/complete`);
      fetchMeetings();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update meeting.");
    }
  };
  if (loading) return <p className="p-6">Loading meetings...</p>;
  return (
    <section>
      <header className="mb-8">
        <p className="eyebrow">Creator studio</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Student meetings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Schedule requests from notifications and manage your upcoming sessions
          here.
        </p>
      </header>
      {meetings.length === 0 ? (
        <div className="surface rounded-3xl p-10 text-center text-slate-500">
          No meetings scheduled yet.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {meetings.map((meeting) => (
            <article key={meeting._id} className="surface rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {meeting.status}
                  </p>
                  <h2 className="mt-1 font-semibold">{meeting.meetingTitle}</h2>
                </div>
                <p className="text-sm text-slate-500">
                  {new Date(meeting.meetingTime).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Student: {meeting.studentId?.name}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Course: {meeting.courseId?.courseName}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(meeting.meetingTime).toLocaleString()}
              </p>
              {meeting.status === "scheduled" && (
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    className="rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-blue-600 dark:border-slate-700"
                    href={meeting.meetingLink}
                    target=""
                    rel="noreferrer"
                  >
                    Open session
                  </a>
                  <button
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => complete(meeting._id)}
                  >
                    Mark completed
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MeetingsPage;
