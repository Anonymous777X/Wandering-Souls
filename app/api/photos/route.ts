export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../lib/mongodb';
import { requireAdmin } from '../../lib/auth';
import Photo from '../../models/Photo';

const MAX_PHOTOS_PER_REQUEST = 200;

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
        console.error('GET /api/photos failed:', error);
        return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        await dbConnect();
        const body = await request.json();
        const { photos } = body; // Expect an array of photo objects { videoId, url }

        if (!photos || !Array.isArray(photos) || photos.length === 0) {
            return NextResponse.json({ error: 'Invalid photos array payload' }, { status: 400 });
        }
        if (photos.length > MAX_PHOTOS_PER_REQUEST) {
            return NextResponse.json(
                { error: `A maximum of ${MAX_PHOTOS_PER_REQUEST} photos can be added at once` },
                { status: 400 }
            );
        }

        const invalid = photos.some((p) =>
            !p ||
            !mongoose.isValidObjectId(p.videoId) ||
            typeof p.url !== 'string' ||
            !/^https?:\/\//i.test(p.url.trim())
        );
        if (invalid) {
            return NextResponse.json(
                { error: 'Each photo needs a valid videoId and an http(s) url' },
                { status: 400 }
            );
        }

        const insertedPhotos = await Photo.insertMany(
            photos.map((p) => ({ videoId: p.videoId, url: p.url.trim() }))
        );

        const formatted = insertedPhotos.map((p) => ({
            id: p._id.toString(),
            videoId: p.videoId.toString(),
            url: p.url
        }));

        return NextResponse.json(formatted, { status: 201 });
    } catch (error) {
        console.error('POST /api/photos failed:', error);
        return NextResponse.json({ error: 'Failed to bulk create photos' }, { status: 500 });
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

        const result = await Photo.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('DELETE /api/photos failed:', error);
        return NextResponse.json({ error: 'Failed to delete photos' }, { status: 500 });
    }
}
