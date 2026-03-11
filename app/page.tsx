'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import VideoFeed from './components/VideoFeed';
import BottomNav from './components/BottomNav';
import PhotoGrid from './components/PhotoGrid';
import { Video, User, Photo } from './lib/mockData';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Videos');
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  // Data States
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track currently viewed video
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [uRes, vRes, pRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/videos'),
          fetch('/api/photos')
        ]);
        if (uRes.ok) setUsers(await uRes.json());
        if (vRes.ok) setVideos(await vRes.json());
        if (pRes.ok) setPhotos(await pRes.json());
      } catch (err) {
        console.error("Failed to fetch public data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  // Derived state for the Photos tab (offset by 1 due to landing image at index 0)
  const activeVideo = activeVideoIndex > 0 ? videos[activeVideoIndex - 1] : undefined;
  const videoUsers = activeVideo ? activeVideo.userIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[] : [];
  const videoPhotos = activeVideo ? photos.filter(p => p.videoId === activeVideo.id) : [];

  if (isLoading) {
    return (
      <div style={{ height: '100vh', width: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#00f3ff', opacity: 0.8, letterSpacing: '0.1em' }} className="animate-pulse-pin">Loading Journeys...</p>
      </div>
    );
  }

  return (
    <main className="app-main">
      {/* Top Bar for Global Controls - Hidden only on Landing Page (Videos tab, index 0) */}
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

      <div style={{ display: activeTab === 'Videos' ? 'block' : 'none' }}>
        <VideoFeed
          activeTab={activeTab}
          isMuted={isMuted}
          showDetails={showDetails}
          videos={videos}
          users={users}
          activeVideoIndex={activeVideoIndex}
          setActiveVideoIndex={setActiveVideoIndex}
        />
      </div>

      <div style={{ display: activeTab === 'Photos' ? 'block' : 'none' }}>
        {activeVideo && (
          <PhotoGrid
            video={activeVideo}
            users={videoUsers}
            photos={videoPhotos}
          />
        )}
      </div>

      <div style={{ display: activeTab === 'Map' ? 'block' : 'none' }}>
        <div className="placeholder-view map-view">
          <h2>Journey Map</h2>
          <p className="subtitle">Interactive map coming soon.</p>
          <div className="mock-map">
            <div className="mock-pin pin-1"></div>
            <div className="mock-pin pin-2"></div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Hidden only on Landing Page (Videos tab, index 0) */}
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
