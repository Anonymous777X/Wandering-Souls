export interface User {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface Video {
    id: string;
    title: string;
    youtubeId: string;
    userIds: string[];
    location: string;
    date: string;
}

export interface Photo {
    id: string;
    videoId: string;
    url: string;
}

export const initialUsers: User[] = [
    { id: 'u1', name: 'Sarah Walker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=150&h=150&fit=crop' },
    { id: 'u2', name: 'David Chen', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&w=150&h=150&fit=crop' },
    { id: 'u3', name: 'Mia Wong', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop' }
];

export const initialVideos: Video[] = [
    {
        id: '1',
        title: 'Spring in Kyoto',
        youtubeId: 'eEzD-Y97ges',
        userIds: ['u1', 'u3'],
        location: 'Kyoto, Japan',
        date: 'April 2024',
    },
    {
        id: '2',
        title: 'Alpine Expedition',
        youtubeId: 'WNeLUngb-Xg',
        userIds: ['u2'],
        location: 'Swiss Alps',
        date: 'Dec 2023',
    }
];

export const initialPhotos: Photo[] = [
    { id: 'p1', videoId: '1', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 'p2', videoId: '1', url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 'p3', videoId: '1', url: 'https://images.unsplash.com/photo-1528362359544-d9fce18d1845?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 'p4', videoId: '1', url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 'p5', videoId: '2', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 'p6', videoId: '2', url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 'p7', videoId: '2', url: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?ixlib=rb-4.0.3&w=800&q=80' }
];
