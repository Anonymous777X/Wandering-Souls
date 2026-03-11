'use client';

import { useRef, useEffect } from 'react';
import SoulCard from './SoulCard';
import { Video, User } from '../lib/mockData';

import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

interface VideoFeedProps {
    isMuted: boolean;
    showDetails: boolean;
    videos: Video[];
    users: User[];
    activeVideoIndex: number;
    setActiveVideoIndex: (index: number) => void;
    activeTab: string; // To pause when navigating away
}

export default function VideoFeed({ isMuted, showDetails, videos, users, activeVideoIndex, setActiveVideoIndex, activeTab }: VideoFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playersRef = useRef<{ [key: string]: YouTubePlayer }>({});

    // Handle play/pause when active video OR active tab changes
    useEffect(() => {
        Object.keys(playersRef.current).forEach((videoId) => {
            const player = playersRef.current[videoId];
            if (!player) return;

            // The actual active video index in the list
            const currentVideo = activeVideoIndex > 0 ? videos[activeVideoIndex - 1] : null;

            if (currentVideo && currentVideo.id === videoId && activeTab === 'Videos') {
                // If it's the active video AND we are on the Videos tab, play it
                try {
                    player.playVideo();
                    if (isMuted) {
                        player.mute();
                    } else {
                        player.unMute();
                    }
                } catch (e) {
                    console.error("Error playing video", e);
                }
            } else {
                // If it's not the active video, OR we navigated away from Videos tab, pause it
                try {
                    player.pauseVideo();
                } catch (e) {
                    console.error("Error pausing video", e);
                }
            }
        });
    }, [activeVideoIndex, videos, isMuted, activeTab]);

    const onReady = (event: YouTubeEvent, videoId: string) => {
        playersRef.current[videoId] = event.target;
        
        // Auto-play initially if it is the active one when it loads
        const currentVideo = activeVideoIndex > 0 ? videos[activeVideoIndex - 1] : null;
        if (currentVideo && currentVideo.id === videoId) {
             event.target.playVideo();
             if (isMuted) {
                 event.target.mute();
             } else {
                 event.target.unMute();
             }
        }
    };

    useEffect(() => {
        // Upon mount, if there's an active video, jump to it immediately
        if (containerRef.current && activeVideoIndex > 0) {
            containerRef.current.scrollTop = activeVideoIndex * window.innerHeight;
        }

        const handleScroll = () => {
            if (!containerRef.current) return;

            const scrollPosition = containerRef.current.scrollTop;
            const windowHeight = window.innerHeight;

            const index = Math.round(scrollPosition / windowHeight);
            if (index !== activeVideoIndex && index >= 0 && index <= videos.length) {
                setActiveVideoIndex(index);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Re-check scroll position on resize
            window.addEventListener('resize', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
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
                // Map userIds to actual User objects for this video
                const videoUsers = video.userIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];

                // Parse videoId just in case the database contains a raw URL
                let videoId = video.youtubeId;
                if (videoId.includes('youtu.be/')) {
                    videoId = videoId.split('youtu.be/')[1].split('?')[0];
                } else if (videoId.includes('v=')) {
                    videoId = videoId.split('v=')[1].split('&')[0];
                } else if (videoId.includes('/shorts/')) {
                    videoId = videoId.split('/shorts/')[1].split('?')[0];
                }

                const opts = {
                    height: '100%',
                    width: '100%',
                    playerVars: {
                        autoplay: 0, // We control it programmatically
                        controls: 0,
                        rel: 0,
                        showinfo: 0,
                        mute: isMuted ? 1 : 0,
                        loop: 1,
                        playlist: videoId,
                        modestbranding: 1,
                        playsinline: 1,
                    },
                };

                return (
                    <div
                        key={video.id}
                        className="video-container"
                    >
                        <div className="video-bg-wrapper">
                            <YouTube 
                                videoId={videoId} 
                                opts={opts} 
                                onReady={(e) => onReady(e, video.id)} 
                                className="video-iframe" 
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
