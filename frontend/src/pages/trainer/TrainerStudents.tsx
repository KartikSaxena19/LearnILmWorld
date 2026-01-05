import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Users, User, X, Video, StopCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------- TrainerStudents ---------- */
const TrainerStudents = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    duration: 60,
    language: "",
    level: "beginner",
    scheduledDate: "",
    scheduledTime: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ---------- Fetch Bookings ---------- */
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/bookings/trainer-bookings`
      );
      setBookings(
        Array.isArray(res.data)
          ? res.data.filter((b) => b.paymentStatus === "completed")
          : []
      );
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Create Session (ZEGO room created on backend) ---------- */
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookings.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {
      setCreating(true);

      const scheduledDateTime = new Date(
        `${sessionData.scheduledDate}T${sessionData.scheduledTime}`
      );

      await axios.post(`${API_BASE_URL}/api/sessions`, {
        ...sessionData,
        bookingIds: selectedBookings,
        scheduledDate: scheduledDateTime.toISOString(),
      });

      setShowCreateModal(false);
      setSelectedBookings([]);
      setSessionData({
        title: "",
        description: "",
        duration: 60,
        language: "",
        level: "beginner",
        scheduledDate: "",
        scheduledTime: "",
      });

      fetchBookings();
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  /* ---------- Trainer joins ZEGO as HOST ---------- */
  const handleJoinSession = async (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  /* ---------- Trainer ends session ---------- */
  const handleEndSession = async (sessionId: string) => {
    const confirm = window.confirm("End this session for all participants?");
    if (!confirm) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/sessions/${sessionId}/end`
      );
      fetchBookings();
    } catch (err) {
      console.error("Failed to end session:", err);
      alert("Failed to end session");
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
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
    <div className="space-y-8 max-w-[1200px] mx-auto p-6">
      <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#2D274B]">My Students</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-5 py-2 rounded-xl bg-[#3B3361] text-[#CBE56A] font-medium hover:bg-[#CBE56A] hover:text-[#2D274B]"
          >
            <Plus className="h-5 w-5 mr-2" /> Create Session
          </button>
        </div>

        {/* Student List */}
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => {
              const session = booking.session;

              return (
                <div
                  key={booking._id || booking.id}
                  className="p-6 bg-white rounded-xl flex justify-between border"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#9787F3] rounded-lg flex items-center justify-center mr-4">
                      <User className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <div className="font-bold text-[#2D274B]">
                        {booking.student?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.student?.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    {session ? (
                      <>
                        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                          SESSION READY
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleJoinSession(session._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#9787F3] text-white rounded-md text-sm"
                          >
                            <Video className="h-4 w-4" /> Start
                          </button>

                          <button
                            onClick={() => handleEndSession(session._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
                          >
                            <StopCircle className="h-4 w-4" /> End
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="flex items-center justify-end gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(
                            booking._id || booking.id
                          )}
                          onChange={() =>
                            toggleBookingSelection(
                              booking._id || booking.id
                            )
                          }
                          className="accent-[#3B3361]"
                        />
                        <span className="text-sm text-gray-600">
                          Select
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-gray-600">No students yet</p>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => !creating && setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create Session</h3>

              <button
                type="button"
                disabled={creating}
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <input
                required
                placeholder="Session Title"
                className="w-full border p-2 rounded"
                value={sessionData.title}
                onChange={(e) =>
                  setSessionData({ ...sessionData, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={sessionData.description}
                onChange={(e) =>
                  setSessionData({ ...sessionData, description: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  required
                  className="border p-2 rounded w-1/2"
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      scheduledDate: e.target.value,
                    })
                  }
                />
                <input
                  type="time"
                  required
                  className="border p-2 rounded w-1/2"
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      scheduledTime: e.target.value,
                    })
                  }
                />
              </div>

              <button
                disabled={creating}
                className="w-full bg-[#9787F3] text-white py-2 rounded"
              >
                {creating ? "Creating..." : "Create Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerStudents;
