import { Link } from "react-router-dom";
import heroImage from '../assets/Indian_student1.jpeg'
import { useState } from "react";

interface CourseProps {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
}

const CourseCard = ({ course }: { course: CourseProps }) => {

  const [isImageLoaded, setIsImageLoaded] = useState(false);


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="h-48 w-full overflow-hidden relative group">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center z-10">
             {/* Optional: Icon ya text daal sakte hain */}
             <span className="text-gray-400 text-xs font-medium">Loading...</span> 
          </div>
        )}
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-700 transform group-hover:scale-105 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}

          onLoad={()=>setIsImageLoaded(true)}
          onError={(e) => {

    console.log("Image Failed for:", course.title);

    e.currentTarget.src = heroImage; 
    
    e.currentTarget.onerror = null; 
    setIsImageLoaded(true)
  }}
        />

        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{course.title}</h3>

        <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
          {course.description}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/courses/${course._id}`}
            className="inline-flex items-center font-semibold text-sm text-gray-900 hover:text-[#276dc9] transition-colors"
          >
            View Details 
            <span className="ml-2 text-lg">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;