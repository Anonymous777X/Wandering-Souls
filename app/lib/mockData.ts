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

export const initialUsers: User[] = [];

export const initialVideos: Video[] = [];

export const initialPhotos: Photo[] = [];
