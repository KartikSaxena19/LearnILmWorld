import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Navbar from '../components/Navbar';

const TrainerProfilePageDemo = () => {
  const { id } = useParams(); 
  const [trainer, setTrainer] = useState(null);
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null); 
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/users/profile/${id}`).then(res => setTrainer(res.data));
  }, [id]);

  const handleUnlockDemo = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to watch the free demo."); 
        navigate('/login'); 
        return; 
      }
      
      const res = await axios.post('/api/bookings/free-demo-access', {
        trainerId: id,
      }, {
         headers: { Authorization: `Bearer ${token}` } 
      });

      if (res.data.success) {
        setVideoUrl(res.data.videoUrl); 
        setShowModal(false); 
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 401) {
         alert("Session expired. Please login again.");
         navigate('/login');
         return;
      }
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!trainer) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#E6E6FA] to-[#FFF0F5]  px-4 sm:px-6 lg:px-8 font-sans">
      <Navbar/>
      <div className="max-w-5xl mx-auto space-y-8 mt-6">
        
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <img 
              src={trainer.profile.imageUrl} 
              className="relative w-48 h-48 rounded-2xl object-cover shadow-lg" 
              alt={trainer.name} 
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 font-serif mb-3">
              {trainer.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {trainer.profile.bio}
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-purple-50 p-6 border-b border-purple-100">
            <h2 className="text-2xl font-bold text-purple-900 font-serif">
              ✨ Free Demo Session
            </h2>
          </div>

          <div className="p-8">
            {videoUrl ? (
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
                {videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? (
                  <iframe 
                    width="100%" 
                    height="500" 
                    src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}?autoplay=1`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full aspect-video"
                  ></iframe>
                ) : (
                  <video src={videoUrl} controls autoPlay className="w-full h-[500px] object-contain" />
                )}
                <div className="bg-green-50 p-3 text-center">
                   <p className="text-green-600 font-medium">✨ Demo Unlocked Successfully!</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-white to-purple-50 rounded-2xl border-2 border-dashed border-purple-200">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                  🎥
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Experience the Teaching Style</h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                  Unlock an exclusive free demo session to see if this mentor is the right fit for your learning journey.
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-white text-pink-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">▶</span>
                    Watch Free Demo
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-purple-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl transform transition-all scale-100">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 text-xl">
                🔓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Unlock Free Demo</h3>
              
              <p className="text-gray-500 mb-6">
                You are about to unlock the free demo class for <span className="font-semibold text-purple-700">{trainer?.name}</span>.
                <br/>
                <span className="text-xs text-pink-500 font-medium mt-2 block bg-pink-50 py-1 px-2 rounded-full mx-auto w-max">
                  Note: One-time access only
                </span>
              </p>

              {error && (
                <div className="bg-red-50 text-red-500 text-sm mb-4 p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button 
                onClick={handleUnlockDemo}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg hover:shadow-pink-500/25"
              >
                Confirm & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfilePageDemo;