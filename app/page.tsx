'use client';

import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import VideoFeed from './components/VideoFeed';
import BottomNav from './components/BottomNav';
import PhotoGrid from './components/PhotoGrid';
import { initialVideos, initialUsers, initialPhotos } from './lib/mockData';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Videos');
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  // Track currently viewed video
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Derived state for the Photos tab (offset by 1 due to landing image at index 0)
  const activeVideo = activeVideoIndex > 0 ? initialVideos[activeVideoIndex - 1] : undefined;
  const videoUsers = activeVideo ? activeVideo.userIds.map(id => initialUsers.find(u => u.id === id)).filter(Boolean) as typeof initialUsers : [];
  const videoPhotos = activeVideo ? initialPhotos.filter(p => p.videoId === activeVideo.id) : [];

  return (
    <main className="app-main">
      {/* Top Bar for Global Controls - Hidden on Landing Page */}
      {(activeTab !== 'Videos' || activeVideoIndex > 0) && (
        <div className="top-bar">
          {activeTab === 'Videos' && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="glass-panel icon-btn animate-breathe"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </div>
      )}

      {activeTab === 'Videos' && (
        <VideoFeed
          isMuted={isMuted}
          showDetails={showDetails}
          videos={initialVideos}
          users={initialUsers}
          activeVideoIndex={activeVideoIndex}
          setActiveVideoIndex={setActiveVideoIndex}
        />
      )}

      {activeTab === 'Photos' && activeVideo && (
        <PhotoGrid
          video={activeVideo}
          users={videoUsers}
          photos={videoPhotos}
        />
      )}

      {activeTab === 'Map' && (
        <div className="placeholder-view map-view">
          <h2>Journey Map</h2>
          <p className="subtitle">Interactive map coming soon.</p>
          <div className="mock-map">
            <div className="mock-pin pin-1"></div>
            <div className="mock-pin pin-2"></div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Hidden on Landing Page */}
      {(activeTab !== 'Videos' || activeVideoIndex > 0) && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
        />
      )}
    </main>
  );
}
