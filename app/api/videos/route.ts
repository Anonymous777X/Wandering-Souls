export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Video from '../../models/Video';
import Photo from '../../models/Photo';

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 });
        const formatted = videos.map((v) => ({
            id: v._id.toString(),
            title: v.title,
            youtubeId: v.youtubeId,
            userIds: v.userIds.map((id: any) => id.toString()),
            location: v.location,
            date: v.date
        }));
        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { title, youtubeId, userIds, location, date } = body;

        let parsedYoutubeId = youtubeId;
        if (youtubeId.includes('youtu.be/')) {
            parsedYoutubeId = youtubeId.split('youtu.be/')[1].split('?')[0];
        } else if (youtubeId.includes('v=')) {
            parsedYoutubeId = youtubeId.split('v=')[1].split('&')[0];
        } else if (youtubeId.includes('/shorts/')) {
            parsedYoutubeId = youtubeId.split('/shorts/')[1].split('?')[0];
        }

        const video = await Video.create({
            title,
            youtubeId: parsedYoutubeId,
            userIds,
            location,
            date
        });

        return NextResponse.json({
            id: video._id.toString(),
            title: video.title,
            youtubeId: video.youtubeId,
            userIds: video.userIds.map((id: any) => id.toString()),
            location: video.location,
            date: video.date
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: 'Invalid ids array format' }, { status: 400 });
        }

        // Cascade delete associated Photos
        await Photo.deleteMany({ videoId: { $in: ids } });

        // Delete the Videos
        await Video.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true, deletedCount: ids.length });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete videos' }, { status: 500 });
    }
}
