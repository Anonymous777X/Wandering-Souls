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
            {videos.map((video, index) => {
                const isActive = index === activeVideoIndex;
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
        </div>
    );
}
