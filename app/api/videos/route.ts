export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../lib/mongodb';
import { requireAdmin } from '../../lib/auth';
import { parseYoutubeId } from '../../lib/youtube';
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
            userIds: v.userIds.map((id: mongoose.Types.ObjectId) => id.toString()),
            location: v.location,
            date: v.date
        }));
        return NextResponse.json(formatted);
    } catch (error) {
        console.error('GET /api/videos failed:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        await dbConnect();
        const body = await request.json();
        const { title, youtubeId, userIds, location, date } = body;

        if (typeof title !== 'string' || !title.trim()) {
            return NextResponse.json({ error: 'A title is required' }, { status: 400 });
        }
        if (typeof youtubeId !== 'string' || !youtubeId.trim()) {
            return NextResponse.json({ error: 'A YouTube URL or id is required' }, { status: 400 });
        }
        if (!Array.isArray(userIds) || userIds.some((id) => !mongoose.isValidObjectId(id))) {
            return NextResponse.json({ error: 'Invalid userIds' }, { status: 400 });
        }

        const parsedYoutubeId = parseYoutubeId(youtubeId);
        if (!parsedYoutubeId) {
            return NextResponse.json({ error: 'Could not read a YouTube id from that URL' }, { status: 400 });
        }

        const video = await Video.create({
            title: title.trim(),
            youtubeId: parsedYoutubeId,
            userIds,
            location,
            date
        });

        return NextResponse.json({
            id: video._id.toString(),
            title: video.title,
            youtubeId: video.youtubeId,
            userIds: video.userIds.map((id: mongoose.Types.ObjectId) => id.toString()),
            location: video.location,
            date: video.date
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/videos failed:', error);
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

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
        const result = await Video.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('DELETE /api/videos failed:', error);
        return NextResponse.json({ error: 'Failed to delete videos' }, { status: 500 });
    }
}
