'use client';

import { useRef, useEffect } from 'react';
import SoulCard from './SoulCard';
import { Video, User } from '../lib/mockData';

interface VideoFeedProps {
    isMuted: boolean;
    showDetails: boolean;
    videos: Video[];
    users: User[];
    activeVideoIndex: number;
    setActiveVideoIndex: (index: number) => void;
}

export default function VideoFeed({ isMuted, showDetails, videos, users, activeVideoIndex, setActiveVideoIndex }: VideoFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const scrollPosition = containerRef.current.scrollTop;
            const windowHeight = window.innerHeight;

            const index = Math.round(scrollPosition / windowHeight);
            if (index !== activeVideoIndex && index >= 0 && index < videos.length) {
                setActiveVideoIndex(index);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [activeVideoIndex, videos.length, setActiveVideoIndex]);

    return (
        <div
            ref={containerRef}
            className="video-feed no-scrollbar smooth-scroll"
        >
            {/* Landing Hero Image (Index 0) */}
            <div className="video-container" style={{ backgroundColor: '#000' }}>
                <div className="video-bg-wrapper">
                    <picture style={{ width: '100%', height: '100%', display: 'block' }}>
                        <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/davovg4nm/image/upload/q_100,f_auto/v1772886534/Gemini_Generated_Image_ggn6viggn6viggn6_bzihxr.png" />
                        <img
                            src="https://res.cloudinary.com/davovg4nm/image/upload/q_100,f_auto/v1772886522/Gemini_Generated_Image_qchnvaqchnvaqchn_1_kxmha9.jpg"
                            alt="SoulJourney Home"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </picture>
                    <div className="video-gradient-overlay" />
                </div>

                {/* Scroll Indicator Prompt (Bottom) */}
                <div style={{ position: 'absolute', bottom: '6rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 20 }}>
                    <div style={{ opacity: 0.9 }} className="animate-pulse-pin">
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontWeight: 500, letterSpacing: '0.05em' }}>Scroll down to explore</span>
                        <br />
                        <span style={{ fontSize: '1.75rem', color: '#00f3ff', textShadow: '0 0 10px rgba(0,243,255,0.8)' }}>↓</span>
                    </div>
                </div>
            </div>

            {videos.map((video, index) => {
                const actualIndex = index + 1;
                const isActive = actualIndex === activeVideoIndex;
                // Map userIds to actual User objects for this video
                const videoUsers = video.userIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];

                return (
                    <div
                        key={video.id}
                        className="video-container"
                    >
                        <div className="video-bg-wrapper">
                            <iframe
                                className="video-iframe"
                                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=${isActive ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${video.youtubeId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                            <div className="video-gradient-overlay" />
                        </div>

                        <SoulCard
                            title={video.title} /* Optional: pass title down to SoulCard */
                            users={videoUsers}
                            location={video.location}
                            date={video.date}
                            showDetails={showDetails}
                        />
                    </div>
                );
            })}

            {/* Empty State when no videos are added by admin */}
            {videos.length === 0 && (
                <div className="video-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f8fafc' }}>The Void is Empty</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>There are currently no soul journeys recorded.</p>
                        <p style={{ color: '#94a3b8' }}>Please add new videos via the Admin Dashboard.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
