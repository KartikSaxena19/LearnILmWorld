import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, CheckCircle, ArrowRight, User } from 'lucide-react';
import axios from 'axios';
import bg_main from '../assets/bg_main.jpeg'
import Navbar from '../components/Navbar';

interface Trainer {
  _id: string;
  name: string;
  profile: {
    bio: string;
    imageUrl: string;
    specializations: string[];
    hourlyRate: number;
    averageRating: number;
  };
}

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/users/trainers'); 
        setTrainers(res.data.trainers || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load featured trainers");
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return null;

  return (
        <div className="min-h-screen font-inter text-[#2D274B] transition-colors duration-500 bg-[#FFFAF1] bg-fixed"
              style={{
                backgroundImage:
                  `url(${bg_main})`,
                position: "relative",
                backgroundSize: "cover",
                backgroundPosition: "right bottom",
                backgroundRepeat: "no-repeat",
                width: "100%",
              }}
            >
                <Navbar/>
      <div className="max-w-7xl pt-4 mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Featured Mentors</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Top-rated experts ready to help you master your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trainers.slice(0, 3).map((trainer) => (
            <div key={trainer._id} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
              
              <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow-md text-white flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> FEATURED
              </div>

              <div className="h-64 overflow-hidden relative">
                {!trainer.profile.imageUrl ? (
                    <User className='h-full w-full bg-pink-400'/>
                ) : (
                  <img 
                    src={trainer.profile.imageUrl} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                
                <div className="absolute bottom-4 left-4 text-white">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     {trainer.name} 
                     <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                   </h3>
                   <p className="text-sm text-gray-200">{trainer.profile.specializations[0]}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {trainer.profile.bio || "Passionate educator helping students achieve their academic goals."}
                </p>

                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" /> 
                    <span className="text-gray-800">{trainer.profile.averageRating || 5.0}</span>
                  </div>
                  <div className="text-purple-600 font-bold text-lg">
                    ${trainer.profile.hourlyRate}/hr
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/trainer/profile/${trainer._id}`)}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    View Profile
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/trainer/profile/${trainer._id}`)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" /> Demo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/trainer')}
            className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-all flex items-center justify-center gap-2 mx-auto"
          >
            View All Tutors <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>
  );
};

export default FeaturedSection;