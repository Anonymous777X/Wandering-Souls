export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 });
        // Map _id back to id for frontend compatibility
        const formatted = users.map((u) => ({
            id: u._id.toString(),
            name: u.name,
            avatarUrl: u.avatarUrl
        }));
        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, avatarUrl } = body;

        // Fallback avatar handling using UI Avatars with Neon Blue styling
        const newAvatarUrl = avatarUrl && avatarUrl.trim() !== ''
            ? avatarUrl
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=020617&color=00f3ff&size=150`;

        const user = await User.create({ name, avatarUrl: newAvatarUrl });

        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            avatarUrl: user.avatarUrl
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
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

        await User.deleteMany({ _id: { $in: ids } });
        return NextResponse.json({ success: true, deletedCount: ids.length });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete users' }, { status: 500 });
    }
}
