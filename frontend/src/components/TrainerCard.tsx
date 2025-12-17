// FILE: src/components/TrainerCard.tsx
import React, { useRef, useState } from 'react'
import { Play, User, Star, Clock, MapPin, X, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import * as Flags from 'country-flag-icons/react/3x2'


const renderFlag = (code?: string) => {
  if (!code) return null;
  const upper = code.toUpperCase();
  const Flag = (Flags as any)[upper];
  if (!Flag) return null;
  return (
    <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm">
      <Flag title={upper} className="w-full h-full object-cover" />
    </div>
  )
}


interface Props { trainer: any; learningType: string }

const TrainerCard: React.FC<Props> = ({ trainer, learningType }) => {

  const [openVideo, setOpenVideo] = useState(false)
  const [fav, setFav] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const navigate = useNavigate()


  const avatar = trainer.profile?.imageUrl || trainer.profile?.avatar || ''
  const rating = (trainer.stats?.rating ?? trainer.profile?.averageRating) || 0
  const reviews = trainer.profile?.totalBookings || 0


  const languagesList = (Array.isArray(trainer.profile?.trainerLanguages) && trainer.profile!.trainerLanguages!.length > 0)
    ? trainer.profile!.trainerLanguages!.slice(0, 3).map((tl: any) => tl.language || '')
    : (Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.slice(0, 3) : [])


  return (
    <article className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105 ring-1 ring-gray-50 flex flex-col" style={{ minHeight: 360 }}>
      {/* top image/video */}
      {trainer.profile?.demoVideo ? (
        <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-100">
          {!openVideo ? (
            <>
              <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                {(avatar)
                  ? <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover brightness-80" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
              </div>

              <button onClick={() => setOpenVideo(true)} className="absolute inset-0 flex items-center justify-center" aria-label="Play demo">
                <div className="bg-white/95 hover:bg-white p-3 rounded-full shadow-2xl flex items-center justify-center border border-white">
                  <Play className="h-6 w-6 text-[#9787F3]" />
                </div>
              </button>
            </>
          ) : (
            <>
              <div className="w-full h-44 bg-black">
                {/* simple handling — if youtube embed is preferred you can transform the url */}
                <video ref={el => videoRef.current = el} src={trainer.profile.demoVideo} controls playsInline className="w-full h-full object-cover" />
              </div>
              <button onClick={() => setOpenVideo(false)} className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1 shadow" aria-label="Close video">
                <X className="h-4 w-4 text-[#4A4470]" />
              </button>
            </>
          )}

        </div>
      ) : (
        <div className="mb-4 w-full h-44 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {(avatar)
            ? <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
            : <User className="h-10 w-10 text-gray-400" />
          }
        </div>
      )}


      <div className="flex flex-wrap items-start justify-between gap-y-3 mb-3">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-12 h-12 bg-[#9787F3] rounded-lg flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
            {avatar
              ? <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
              : <User className="h-6 w-6 text-white" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">{renderFlag(trainer.profile?.nationalityCode)}
              <h3 className="text-lg font-semibold text-[#2D274B] truncate">
                {trainer.name || 'Unnamed Trainer'}
              </h3>
            </div>
            <div className="flex flex-wrap items-center text-sm text-[#6A6592] mt-1 gap-2">
              <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-sm"><Star className="h-4 w-4" /><span className="font-medium">{Number(rating).toFixed(1)}</span></div><span className="text-sm text-gray-500">({reviews} reviews)</span></div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="px-3 py-1 bg-[#9787F3] text-white rounded-full font-semibold text-sm sm:text-base">
            ${Number(trainer.profile?.hourlyRate || 25)}/hr
          </div>
        </div>

      </div>

      {learningType === 'language' && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1 font-medium">🌐 Languages I Teach</p>
          <div className="flex flex-wrap gap-2">
            {languagesList.map((l: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-gray-50 border rounded-xl text-sm text-gray-800 shadow-sm">{l}</span>
            ))}
          </div>
        </div>
      )}


      {learningType === 'subject' && (trainer.profile?.specializations?.length > 0) && (
        <div className="mb-3"><p className="text-xs text-gray-500 mb-1 font-medium">📚 Subjects I Teach</p><div className="flex flex-wrap gap-2">{trainer.profile.specializations.slice(0, 4).map((s: any, i: number) => (<span key={i} className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-800 shadow-sm">{s}</span>))}{trainer.profile.specializations.length > 4 && <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-xl text-sm">+{trainer.profile.specializations.length - 4} more</span>}</div></div>
      )}

      {learningType === 'hobby' && (() => {
        const hobbies = trainer.profile?.hobbies || trainer.profile?.interests || trainer.profile?.skills || []
        return hobbies.length > 0
      })() && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1 font-medium">🎨 Hobbies I Teach</p>
          <div className="flex flex-wrap gap-2">
            {(trainer.profile?.hobbies || trainer.profile?.interests || trainer.profile?.skills || []).slice(0, 4).map((h: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 shadow-sm">{h}</span>
            ))}
            {(trainer.profile?.hobbies || trainer.profile?.interests || trainer.profile?.skills || []).length > 4 && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-xl text-sm">+{(trainer.profile?.hobbies || trainer.profile?.interests || trainer.profile?.skills || []).length - 4} more</span>
            )}
          </div>
        </div>
      )}


      <p className="text-[#6A6592] mb-4 line-clamp-3 flex-1">
        {trainer.profile?.bio || 'Experienced trainer helping students achieve fluency through personalized lessons.'}
      </p>


      <div className="flex items-center gap-4 text-[#6A6592] mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-[#9787F3]" />
          <span>
            {Number(trainer.profile?.experience || 5)}+ years
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-[#9787F3]" />
          <span>{trainer.profile?.location || 'Online'}</span>
        </div>
      </div>


      <div className="mt-auto flex flex-wrap gap-3 justify-between items-center">
        <button onClick={() => setFav(f => !f)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border ${fav ? 'bg-red-100 border-red-300 text-red-600' : 'border-gray-300 text-[#6A6592] hover:bg-gray-100'}`}>
          <Heart className="h-5 w-5" />{fav ? 'Liked' : 'Like'}</button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          <Link to={`/trainer-profile/${trainer._id}`} className="px-4 py-2 bg-gray-100 text-[#4A4470] rounded-lg font-medium hover:bg-[#CBE56A] text-center">View Profile</Link>

          <button onClick={() => navigate(`/book/${trainer._id}`)} className="px-4 py-2 bg-[#CBE56A] text-[#4A4470] rounded-lg font-medium hover:bg-[#CBE56A] text-center">Book Now</button>
        </div>
      </div>


    </article>
  )
}


export default React.memo(TrainerCard)