'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Youtube, Image as ImageIcon, Trash2, UserPlus, FileVideo, Users, LayoutDashboard, LogOut } from 'lucide-react';
import Image from 'next/image';
import { initialUsers, initialVideos, initialPhotos, User, Video, Photo } from '../../lib/mockData';

export default function AdminDashboard() {
    const router = useRouter();

    // Layout State
    const [adminTab, setAdminTab] = useState<'people' | 'journey' | 'photos'>('journey');

    // Data States
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [videos, setVideos] = useState<Video[]>(initialVideos);
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

    // Bulk Deletion States
    const [selectedUsersToDelete, setSelectedUsersToDelete] = useState<string[]>([]);
    const [selectedVideosToDelete, setSelectedVideosToDelete] = useState<string[]>([]);
    const [selectedPhotosToDelete, setSelectedPhotosToDelete] = useState<string[]>([]);

    // Add User Form State
    const [newUserName, setNewUserName] = useState('');
    const [newUserAvatar, setNewUserAvatar] = useState('');

    // Video Form
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [videoLocation, setVideoLocation] = useState('');
    const [videoDate, setVideoDate] = useState('');

    // Photo Form
    const [selectedVideoId, setSelectedVideoId] = useState('');
    const [photoUrlsInput, setPhotoUrlsInput] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isLoggedIn) {
            router.push('/admin');
            return;
        }

        const fetchData = async () => {
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
                console.error("Failed to fetch admin data", err);
            }
        };
        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        router.push('/admin');
    };

    /* HANDLERS */
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newUserName, avatarUrl: newUserAvatar })
            });
            if (res.ok) {
                const savedUser = await res.json();
                setUsers([savedUser, ...users]); // Add to top
                setNewUserName('');
                setNewUserAvatar('');
            }
        } catch (error) {
            alert('Failed to save user');
        }
    };

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserIds.length === 0) {
            alert("Please select at least one person.");
            return;
        }

        try {
            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: videoTitle,
                    youtubeId: videoUrl,
                    userIds: selectedUserIds,
                    location: videoLocation,
                    date: videoDate
                })
            });
            if (res.ok) {
                const savedVideo = await res.json();
                setVideos([savedVideo, ...videos]);
                setVideoTitle(''); setVideoUrl(''); setVideoLocation(''); setVideoDate(''); setSelectedUserIds([]);
            }
        } catch (error) {
            alert('Failed to save journey');
        }
    };

    const handleAddPhotos = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVideoId) {
            alert("Please select a parent journey (video).");
            return;
        }

        const urls = photoUrlsInput.split(',').map(u => u.trim()).filter(Boolean);
        if (urls.length === 0) return;

        const newPhotos = urls.map(url => ({
            videoId: selectedVideoId,
            url
        }));

        try {
            const res = await fetch('/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photos: newPhotos })
            });
            if (res.ok) {
                const savedPhotos = await res.json();
                setPhotos([...savedPhotos, ...photos]);
                setPhotoUrlsInput('');
                setSelectedVideoId('');
            }
        } catch (error) {
            alert('Failed to save photos');
        }
    };

    /* DELETION LOGIC */
    const handleBulkDeleteUsers = async () => {
        if (selectedUsersToDelete.length === 0) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedUsersToDelete.length} selected user(s)?`);
        if (confirmDelete) {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedUsersToDelete })
            });
            if (res.ok) {
                setUsers(users.filter(u => !selectedUsersToDelete.includes(u.id)));
                setSelectedUsersToDelete([]);
            }
        }
    };

    const handleBulkDeleteVideos = async () => {
        if (selectedVideosToDelete.length === 0) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedVideosToDelete.length} selected Journey(s)? This will also delete all associated Photos.`);
        if (confirmDelete) {
            const res = await fetch('/api/videos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedVideosToDelete })
            });
            if (res.ok) {
                setVideos(videos.filter(v => !selectedVideosToDelete.includes(v.id)));
                setPhotos(photos.filter(p => !selectedVideosToDelete.includes(p.videoId)));
                setSelectedVideosToDelete([]);
            }
        }
    };

    const handleBulkDeletePhotos = async () => {
        if (selectedPhotosToDelete.length === 0) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedPhotosToDelete.length} selected photo(s)?`);
        if (confirmDelete) {
            const res = await fetch('/api/photos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedPhotosToDelete })
            });
            if (res.ok) {
                setPhotos(photos.filter(p => !selectedPhotosToDelete.includes(p.id)));
                setSelectedPhotosToDelete([]);
            }
        }
    };

    const toggleDeleteSelection = (
        id: string,
        selectedList: string[],
        setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (selectedList.includes(id)) {
            setSelectedList(selectedList.filter(itemId => itemId !== id));
        } else {
            setSelectedList([...selectedList, id]);
        }
    };

    const toggleUserSelection = (id: string) => {
        if (selectedUserIds.includes(id)) {
            setSelectedUserIds(selectedUserIds.filter(uid => uid !== id));
        } else {
            setSelectedUserIds([...selectedUserIds, id]);
        }
    };

    /* RENDERING VIEWS */
    const renderPeopleManagement = () => (
        <div className="dashboard-grid flex flex-col lg:grid lg:grid-cols-2 gap-8">
            <div className="glass-panel dashboard-panel">
                <h2 className="panel-title mx-auto"><UserPlus size={20} className="icon-accent" /> Add New Person</h2>
                <form onSubmit={handleAddUser} className="dashboard-form">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="admin-input"
                        required
                    />
                    <input
                        type="url"
                        placeholder="Avatar Image URL (Optional)"
                        value={newUserAvatar}
                        onChange={(e) => setNewUserAvatar(e.target.value)}
                        className="admin-input"
                    />
                    <button type="submit" className="admin-btn-primary">Add Person</button>
                </form>
            </div>

            <div className="glass-panel dashboard-panel">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="panel-title mb-0"><Users size={20} className="icon-accent" /> Managed People</h2>
                    {selectedUsersToDelete.length > 0 && (
                        <button onClick={handleBulkDeleteUsers} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 font-medium">
                            <Trash2 size={16} /> Delete Selected ({selectedUsersToDelete.length})
                        </button>
                    )}
                </div>
                <div className="user-list">
                    {users.map(user => (
                        <div key={user.id} className="user-card flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                                checked={selectedUsersToDelete.includes(user.id)}
                                onChange={() => toggleDeleteSelection(user.id, selectedUsersToDelete, setSelectedUsersToDelete)}
                            />
                            <div className="avatar-img-wrapper" style={{ flexShrink: 0 }}>
                                <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="avatar-img" unoptimized={true} />
                            </div>
                            <span className="flex-1 font-medium">{user.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderJourneyManagement = () => (
        <div className="dashboard-grid flex flex-col lg:grid lg:grid-cols-2 gap-8">
            <div className="glass-panel dashboard-panel">
                <h2 className="panel-title"><Youtube size={20} className="icon-accent" /> Add Journey (Video)</h2>
                <form onSubmit={handleAddVideo} className="dashboard-form">
                    <input
                        type="text"
                        placeholder="Journey Title (e.g., Swiss Alps Hike)"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="admin-input"
                        required
                    />
                    <input
                        type="url"
                        placeholder="YouTube Video URL"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="admin-input"
                        required
                    />

                    <div className="my-2">
                        <p className="text-sm text-[var(--text-secondary)] mb-2 font-medium">Select People Involved:</p>
                        <div className="user-chips-container">
                            {users.map(user => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => toggleUserSelection(user.id)}
                                    className={`user-chip ${selectedUserIds.includes(user.id) ? 'selected' : ''}`}
                                >
                                    {user.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-grid">
                        <input
                            type="text"
                            placeholder="Location"
                            value={videoLocation}
                            onChange={(e) => setVideoLocation(e.target.value)}
                            className="admin-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Date (e.g. Apr 2024)"
                            value={videoDate}
                            onChange={(e) => setVideoDate(e.target.value)}
                            className="admin-input"
                            required
                        />
                    </div>
                    <button type="submit" className="admin-btn-primary">Save Journey</button>
                </form>
            </div>

            <div className="glass-panel dashboard-panel">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="panel-title mb-0"><FileVideo size={20} className="icon-accent" /> Managed Journeys</h2>
                    {selectedVideosToDelete.length > 0 && (
                        <button onClick={handleBulkDeleteVideos} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 font-medium">
                            <Trash2 size={16} /> Delete Selected ({selectedVideosToDelete.length})
                        </button>
                    )}
                </div>
                {videos.length === 0 ? (
                    <p className="empty-state">No journeys added yet.</p>
                ) : (
                    <div className="entries-list" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {videos.map(video => (
                            <div key={video.id} className="entry-card flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                                    checked={selectedVideosToDelete.includes(video.id)}
                                    onChange={() => toggleDeleteSelection(video.id, selectedVideosToDelete, setSelectedVideosToDelete)}
                                />
                                <div className="entry-info flex-1">
                                    <span className="entry-title">
                                        <Youtube size={14} className="icon-video" /> {video.title}
                                    </span>
                                    <span className="entry-date">{video.location} • {video.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderPhotoManagement = () => (
        <div className="dashboard-grid flex flex-col lg:grid lg:grid-cols-2 gap-8">
            <div className="glass-panel dashboard-panel">
                <h2 className="panel-title"><ImageIcon size={20} className="icon-accent" /> Add Photos to Journey</h2>
                <form onSubmit={handleAddPhotos} className="dashboard-form">
                    <select
                        value={selectedVideoId}
                        onChange={(e) => setSelectedVideoId(e.target.value)}
                        className="admin-select"
                        required
                    >
                        <option value="" disabled>Select parent Journey...</option>
                        {videos.map(video => (
                            <option key={video.id} value={video.id}>{video.title}</option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Paste one or multiple Image URLs here (comma separated)"
                        value={photoUrlsInput}
                        onChange={(e) => setPhotoUrlsInput(e.target.value)}
                        className="admin-textarea"
                        required
                    />

                    <button type="submit" className="admin-btn-primary">Bulk Add Photos</button>
                </form>
            </div>

            <div className="glass-panel dashboard-panel">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="panel-title mb-0"><ImageIcon size={20} className="icon-accent" /> Managed Photos</h2>
                    {selectedPhotosToDelete.length > 0 && (
                        <button onClick={handleBulkDeletePhotos} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 font-medium">
                            <Trash2 size={16} /> Delete Selected ({selectedPhotosToDelete.length})
                        </button>
                    )}
                </div>
                {photos.length === 0 ? (
                    <p className="empty-state">No photos added yet.</p>
                ) : (
                    <div className="entries-list" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {photos.map(photo => {
                            const parentVideo = videos.find(v => v.id === photo.videoId);
                            return (
                                <div key={photo.id} className="entry-card flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                                        checked={selectedPhotosToDelete.includes(photo.id)}
                                        onChange={() => toggleDeleteSelection(photo.id, selectedPhotosToDelete, setSelectedPhotosToDelete)}
                                    />
                                    <div className="entry-info flex-1" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                            <Image src={photo.url} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="entry-title text-sm">{parentVideo?.title || 'Unknown Parent Journey'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="admin-wrapper">
            {/* SIDEBAR NAVIGATION */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <LayoutDashboard size={24} className="text-[var(--accent-color)]" />
                    <span>SoulJourney</span>
                </div>

                <nav className="admin-sidebar-nav">
                    <button
                        onClick={() => setAdminTab('people')}
                        className={`admin-sidebar-btn ${adminTab === 'people' ? 'active' : ''}`}
                    >
                        <Users size={18} /> Manage People
                    </button>
                    <button
                        onClick={() => setAdminTab('journey')}
                        className={`admin-sidebar-btn ${adminTab === 'journey' ? 'active' : ''}`}
                    >
                        <Youtube size={18} /> Manage Journeys
                    </button>
                    <button
                        onClick={() => setAdminTab('photos')}
                        className={`admin-sidebar-btn ${adminTab === 'photos' ? 'active' : ''}`}
                    >
                        <ImageIcon size={18} /> Manage Photos
                    </button>
                </nav>

                <div className="mt-auto">
                    <button onClick={handleLogout} className="admin-sidebar-btn w-full">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="admin-content">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold mb-2 text-[var(--text-primary)]">
                            {adminTab === 'people' && 'People Management'}
                            {adminTab === 'journey' && 'Journey & Video Operations'}
                            {adminTab === 'photos' && 'Photo Archive Control'}
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            {adminTab === 'people' && 'Add tracking profiles for individuals appearing in your journeys.'}
                            {adminTab === 'journey' && 'Create a new journey block, assign people to it, and watch the timeline map update.'}
                            {adminTab === 'photos' && 'Bulk upload external photos and meticulously assign them to your active journeys.'}
                        </p>
                    </div>

                    {/* Conditional Rendering of Views */}
                    {adminTab === 'people' && renderPeopleManagement()}
                    {adminTab === 'journey' && renderJourneyManagement()}
                    {adminTab === 'photos' && renderPhotoManagement()}
                </div>
            </main>
        </div>
    );
}
