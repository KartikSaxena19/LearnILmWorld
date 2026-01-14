import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FileText, ArrowLeft } from "lucide-react";

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // couse detail on the basis of id
    axios.get(`${API_BASE_URL}/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error("Error fetching course:", err));
  }, [id]);

  if (!course) return <div className="p-10 text-center">Loading Content...</div>;

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };


  const openNotesInNewTab = () => {
    if (course.pdfUrl) {
      window.open(course.pdfUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/student/courses" className="inline-flex items-center text-gray-500 hover:text-pink-600 font-medium mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2"/> Back to Courses
        </Link>

        {/* --- MAIN VIEWER AREA --- */}
        {course.videoUrl ? (
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border border-gray-200">
            <iframe 
              className="w-full h-full"
              src={getYoutubeEmbed(course.videoUrl)} 
              title="Video Player"
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        ) : (
          <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
            No Video Available
          </div>
        )}

        <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left side of the screen */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
            <p className="text-gray-600 leading-relaxed text-base">
              {course.description}
            </p>
          </div>

        {/* Right side of the screen */}
        {course.pdfUrl && (
            <button 
              onClick={openNotesInNewTab}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 whitespace-nowrap"
            >
              <FileText size={20} />
              Open Notes PDF ↗
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default CoursePlayer;