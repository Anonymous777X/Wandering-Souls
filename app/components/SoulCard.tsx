'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { User } from '../lib/mockData';

interface SoulCardProps {
    title?: string;
    users: User[];
    location: string;
    date: string;
    showDetails: boolean;
}

export default function SoulCard({ title, users, location, date, showDetails }: SoulCardProps) {
    return (
        <AnimatePresence>
            {showDetails && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="soul-card-wrapper centered"
                >
                    <div className="glass-panel soul-card animate-breathe dynamic-width">
                        <div className="sc-header">
                            <div className="sc-person">
                                <div className="avatar-group">
                                    {users.length > 0 ? (
                                        users.map((user, idx) => (
                                            <div key={user.id} className="avatar-img-wrapper" style={{ zIndex: 10 - idx, marginLeft: idx > 0 ? '-10px' : '0' }}>
                                                <Image
                                                    src={user.avatarUrl}
                                                    alt={user.name}
                                                    width={32}
                                                    height={32}
                                                    className="avatar-img"
                                                    unoptimized={true}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <UserIcon size={16} />
                                    )}
                                </div>
                                <div className="sc-title-group">
                                    <h3>{title || users.map(u => u.name).join(', ')}</h3>
                                    {title && <span className="sc-subtitle">{users.map(u => u.name).join(', ')}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="sc-details">
                            <button className="sc-location-btn">
                                <MapPin size={14} className="animate-pulse-pin pin-icon" />
                                <span>{location}</span>
                            </button>

                            <div className="sc-date">
                                <Calendar size={14} />
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
