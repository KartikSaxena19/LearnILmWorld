import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Video, Clock } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainerSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sessions/my-sessions`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Session State Updates ---------- */
  const updateSessionStatus = async (sessionId: string, status: string) => {
    await axios.put(
      `${API_BASE_URL}/api/sessions/${sessionId}/status`,
      { status }
    );
  };

  /* ---------- Trainer starts session ---------- */
  const handleStartSession = async (sessionId: string) => {
    try {
      await updateSessionStatus(sessionId, "active");
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  /* ---------- Trainer joins active session ---------- */
  const handleJoinSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  /* ---------- Trainer ends session ---------- */
  const handleEndSession = async (sessionId: string) => {
    const confirmEnd = window.confirm("End this session for all participants?");
    if (!confirmEnd) return;

    try {
      await updateSessionStatus(sessionId, "ended");
      fetchSessions();
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-900">My Sessions</h2>
        <Link
          to="/trainer/students"
          className="px-5 py-2 rounded-xl bg-[#3B3361] text-[#CBE56A] font-medium hover:bg-[#CBE56A] hover:text-[#2D274B]"
        >
          <Calendar className="h-5 w-5 mr-2 inline" />
          Create New Session
        </Link>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id || session.id}
                className="p-5 bg-gray-50 rounded-xl border"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#CBE56A] rounded-lg flex items-center justify-center">
                      <Video className="h-5 w-5 text-[#3B3361]" />
                    </div>

                    <div>
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(session.scheduledDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {session.students?.length || 0} student(s)
                      </p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-200">
                      {session.status.toUpperCase()}
                    </span>

                    <div className="flex gap-2">
                      {session.status === "scheduled" && (
                        <button
                          onClick={() => handleStartSession(session._id)}
                          className="px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg text-sm"
                        >
                          Start
                        </button>
                      )}

                      {session.status === "active" && (
                        <>
                          <button
                            onClick={() => handleJoinSession(session._id)}
                            className="px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg text-sm flex items-center"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </button>

                          <button
                            onClick={() => handleEndSession(session._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                          >
                            End
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-3 gap-3">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {session.duration}m</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Calendar className="mx-auto h-7 w-7 text-gray-400" />
            <p className="mt-2 text-gray-600">No sessions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerSessions;
