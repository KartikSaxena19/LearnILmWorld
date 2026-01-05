// FILE: src/components/TrainersGrid.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import TrainerCard from './TrainerCard'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


interface Trainer { _id: string }

interface Props { searchTerm: string; filters: any; learningType: string; setNationalities: (list: string[]) => void; }


const TrainersGrid: React.FC<Props> = ({ searchTerm, filters, learningType, setNationalities, }) => {
    const loadMoreRef = useRef<HTMLDivElement | null>(null)
    const [trainers, setTrainers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [allNationalities, setAllNationalities] = useState<string[]>([])


    // reset page when filters/search/learningType changes
    useEffect(() => {
        setPage(1)
        setHasMore(true)
        setTrainers([])
    }, [JSON.stringify({
        language: filters.language || '',
        specialization: filters.specialization || '',
        hobby: filters.hobby || '',
        minRate: filters.minRate || '',
        maxRate: filters.maxRate || '',
        experience: filters.experience || '0',
        rating: filters.rating || '',
        sortBy: filters.sortBy || 'rating',
        nationality: filters.nationality || ''
    }), searchTerm, learningType])


    const buildQueryParams = useCallback(() => {
        const params: any = {
            page,
            limit: 6
        }

        if (filters.language && filters.language.trim()) params.language = filters.language
        if (filters.specialization && filters.specialization.trim()) params.specialization = filters.specialization
        if (filters.hobby && filters.hobby.trim()) params.specialization = filters.hobby
        if (filters.minRate && filters.minRate.trim()) params.minRate = filters.minRate
        if (filters.maxRate && filters.maxRate.trim()) params.maxRate = filters.maxRate
        if (filters.experience && filters.experience !== '0') params.experience = filters.experience
        if (filters.rating && filters.rating.trim()) params.rating = filters.rating
        if (filters.sortBy && filters.sortBy !== 'rating') params.sortBy = filters.sortBy
        // Remove nationality from backend params - will filter on frontend
        // if (filters.nationality && filters.nationality.trim()) params.nationalityCode = filters.nationality
        if (searchTerm && searchTerm.trim()) params.search = searchTerm

        return params
    }, [filters, searchTerm, page])


    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            if (page === 1) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            try {
                const params = buildQueryParams()
                const res = await axios.get(`${API_BASE_URL}/api/users/trainers`, { params })
                const list = res.data.trainers || []

                // Keep only verified trainers
                let verified = list.filter((t: any) => t?.profile?.verificationStatus === 'verified')

                // Collect nationalities from all pages (not just first page)
                const currentNationalities = Array.from(
                    new Set(verified.map((t: any) => t.profile?.nationalityCode).filter(Boolean))
                ) as string[]

                // Update local nationalities and pass to parent
                setAllNationalities(prev => {
                    const combined = [...prev, ...currentNationalities]
                    const uniqueNationalities = Array.from(new Set(combined))
                    setNationalities(uniqueNationalities)
                    return uniqueNationalities
                })

                // Filter by learning type - only show trainers with specializations for subject learning
                if (learningType === 'subject') {
                    verified = verified.filter((t: any) =>
                        t.profile?.specializations &&
                        Array.isArray(t.profile.specializations) &&
                        t.profile.specializations.length > 0
                    )
                }

                // Filter by learning type - only show trainers with hobbies for hobby learning
                if (learningType === 'hobby') {
                    verified = verified.filter((t: any) => {
                        const hobbies = t.profile?.hobbies || t.profile?.interests || t.profile?.skills
                        return hobbies && Array.isArray(hobbies) && hobbies.length > 0
                    })
                }

                // Apply frontend nationality filter
                if (filters.nationality && filters.nationality.trim()) {
                    verified = verified.filter((t: any) => t.profile?.nationalityCode === filters.nationality)
                }

                // fetch counts and merge
                const countsRes = await axios.get(`${API_BASE_URL}/api/reviews/counts`)
                const counts = countsRes.data || {}
                const merged = verified.map((t: any) => ({ ...t, profile: { ...t.profile, totalBookings: counts[t._id] || 0 } }))

                if (mounted) {
                    setTrainers(prev => {
                        if (page === 1) {
                            return merged
                        } else {
                            // Prevent duplicates by filtering out trainers that already exist
                            const existingIds = new Set(prev.map(t => t._id))
                            const newTrainers = merged.filter((t: any) => !existingIds.has(t._id))
                            return [...prev, ...newTrainers]
                        }
                    })
                    // Set hasMore based on original API response, not filtered results
                    setHasMore(list.length === 6)
                }
            } catch (err) {
                console.error('Trainers fetch failed', err)
                if (mounted && page === 1) setTrainers([])
            } finally {
                if (mounted) {
                    setLoading(false)
                    setLoadingMore(false)
                }
            }
        }

        fetchData()
        return () => { mounted = false }
    }, [buildQueryParams, page])


    // infinite scroll observer
    useEffect(() => {
        if (!loadMoreRef.current || !hasMore || loadingMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0]
                if (first.isIntersecting && !loadingMore && hasMore) {
                    setPage(p => p + 1)
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        )

        observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [loadingMore, hasMore])

    if (loading && page === 1) {
        return (
            <div className="py-20 text-center text-[#F64EBB]">
                <p className="text-xl font-bold animate-pulse">Loading trainers...</p>
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 text-center">
                <p className="text-lg font-bold text-[#F64EBB]">
                    Found <span className="font-bold text-[#2D274B]">{trainers.length}</span> verified trainers
                </p>
            </div>


            <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {trainers.map((t, idx) => (
                    <TrainerCard key={t._id || idx} trainer={t} learningType={learningType} />
                ))}
            </div>


            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {loadingMore && (
                    <div className="flex items-center gap-2 text-white">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Loading more trainers...</span>
                    </div>
                )}
            </div>

            {/* Show load more button */}
            {!loadingMore && hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-6 py-3 bg-[#CBE56A] text-[#2D274B] rounded-lg font-semibold hover:bg-[#b8d155] transition"
                    >
                        Load More Trainers
                    </button>
                </div>
            )}


            {trainers.length === 0 && !loading && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        {/* icon */}
                    </div>
                    <h3 className="text-2xl font-bold text-[#2D274B] mb-4">No trainers found</h3>
                    <p className="text-[#6A6592] mb-8">Try adjusting your search criteria or filters</p>
                </div>
            )}
        </>
    )
}


export default TrainersGrid