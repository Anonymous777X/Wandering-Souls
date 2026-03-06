'use client';

import { PlaySquare, Image as ImageIcon, MapPin, Info } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    showDetails: boolean;
    setShowDetails: (show: boolean) => void;
}

export default function BottomNav({ activeTab, setActiveTab, showDetails, setShowDetails }: BottomNavProps) {
    const tabs = [
        { name: 'Videos', icon: PlaySquare },
        { name: 'Photos', icon: ImageIcon },
        { name: 'Map', icon: MapPin },
    ];

    return (
        <nav className="bottom-nav">
            <div className="glass-nav nav-bar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.name;

                    return (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="nav-label">{tab.name}</span>
                            {isActive && (
                                <div className="nav-indicator" />
                            )}
                        </button>
                    );
                })}

                {/* Info Toggle Button */}
                {activeTab === 'Videos' && (
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`nav-item icon-toggle ${showDetails ? 'active' : ''}`}
                        aria-label="Toggle Details"
                    >
                        <Info size={24} strokeWidth={showDetails ? 2.5 : 2} />
                        <span className="nav-label">Info</span>
                        {showDetails && (
                            <div className="nav-indicator" />
                        )}
                    </button>
                )}
            </div>
        </nav>
    );
}
