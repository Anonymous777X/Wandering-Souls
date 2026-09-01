'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, MapPin, CalendarDays } from 'lucide-react';
import { User, Photo, Video } from '../lib/mockData';
import { isOptimizableImage } from '../lib/imageHosts';

interface PhotoGridProps {
    video: Video;
    users: User[];
    photos: Photo[];
}

export default function PhotoGrid({ video, users, photos }: PhotoGridProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    // The lightbox portals into document.body, which only exists after hydration.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
            setSelectedPhotoIndex(selectedPhotoIndex + 1);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
            setSelectedPhotoIndex(selectedPhotoIndex - 1);
        }
    };

    const closeModal = () => setSelectedPhotoIndex(null);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="photo-view-container no-scrollbar"
            >
                <div className="photo-header glass-panel">
                    <h2 className="photo-title">{video.title}</h2>
                    <div className="participant-avatars">
                        {users.map(user => (
                            <div key={user.id} className="participant">
                                <div className="large-avatar-wrapper" style={{ width: '80px', height: '80px' }}>
                                    <Image
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        fill
                                        className="avatar-img"
                                        unoptimized={!isOptimizableImage(user.avatarUrl)}
                                    />
                                </div>
                                <span className="participant-name">{user.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="photo-location flex items-center justify-center mt-2">
                        <span className="flex items-center"><MapPin size={16} className="text-[var(--accent-color)] mr-1" /> {video.location}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="flex items-center ml-6"><CalendarDays size={16} className="text-[var(--accent-color)] mr-1" /> {video.date}</span>
                    </div>
                </div>

                <div className="photo-gallery" style={{ display: photos.length > 0 ? 'grid' : 'flex', justifyContent: 'center' }}>
                    {photos.length > 0 ? (
                        photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                whileHover={{ scale: 1.02 }}
                                className="photo-item glass-panel cursor-pointer"
                                onClick={() => setSelectedPhotoIndex(index)}
                            >
                                <Image
                                    src={photo.url}
                                    alt="Memory"
                                    fill
                                    className="gallery-img"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    unoptimized={!isOptimizableImage(photo.url)}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="empty-state text-center mt-12 w-full">
                            <p className="text-[var(--text-secondary)]">No photos uploaded for this journey yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {mounted ? createPortal(
                <AnimatePresence>
                    {selectedPhotoIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="lightbox-overlay"
                        >
                            {/* Always visible close button */}
                            <button
                                onClick={closeModal}
                                className="lightbox-close-btn"
                            >
                                <X size={28} />
                            </button>

                            {/* Navigation Left Hitbox (Left screen area) */}
                            {selectedPhotoIndex > 0 && (
                                <div
                                    className="lightbox-nav-zone left"
                                    onClick={handlePrev}
                                >
                                    <div className="lightbox-nav-btn">
                                        <ChevronLeft size={36} />
                                    </div>
                                </div>
                            )}

                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                src={photos[selectedPhotoIndex].url}
                                alt="Enlarged Memory"
                                className="lightbox-image"
                            />

                            {/* Navigation Right Hitbox */}
                            {selectedPhotoIndex < photos.length - 1 && (
                                <div
                                    className="lightbox-nav-zone right"
                                    onClick={handleNext}
                                >
                                    <div className="lightbox-nav-btn">
                                        <ChevronRight size={36} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            ) : null}
        </>
    );
}
