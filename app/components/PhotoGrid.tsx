'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, Photo, Video } from '../lib/mockData';

interface PhotoGridProps {
    video: Video;
    users: User[];
    photos: Photo[];
}

export default function PhotoGrid({ video, users, photos }: PhotoGridProps) {
    return (
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
                            <div className="large-avatar-wrapper">
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    fill
                                    className="avatar-img"
                                />
                            </div>
                            <span className="participant-name">{user.name}</span>
                        </div>
                    ))}
                </div>
                <p className="photo-location">{video.location} • {video.date}</p>
            </div>

            <div className="photo-gallery">
                {photos.length > 0 ? (
                    photos.map(photo => (
                        <motion.div
                            key={photo.id}
                            whileHover={{ scale: 1.02 }}
                            className="photo-item glass-panel"
                        >
                            <Image
                                src={photo.url}
                                alt="Memory"
                                fill
                                className="gallery-img"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-state w-full text-center col-span-full">
                        No photos uploaded for this journey yet.
                    </div>
                )}
            </div>
        </motion.div>
    );
}
