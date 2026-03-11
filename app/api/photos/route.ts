export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Photo from '../../models/Photo';

export async function GET() {
    try {
        await dbConnect();
        const photos = await Photo.find({}).sort({ createdAt: -1 });
        const formatted = photos.map((p) => ({
            id: p._id.toString(),
            videoId: p.videoId.toString(),
            url: p.url
        }));
        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { photos } = body; // Expect an array of photo objects { videoId, url }

        if (!photos || !Array.isArray(photos)) {
            return NextResponse.json({ error: 'Invalid photos array payload' }, { status: 400 });
        }

        const insertedPhotos = await Photo.insertMany(photos);

        const formatted = insertedPhotos.map((p) => ({
            id: p._id.toString(),
            videoId: p.videoId.toString(),
            url: p.url
        }));

        return NextResponse.json(formatted, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to bulk create photos' }, { status: 500 });
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

        await Photo.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true, deletedCount: ids.length });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete photos' }, { status: 500 });
    }
}
