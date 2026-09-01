export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import { requireAdmin } from '../../lib/auth';
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
        console.error('GET /api/users failed:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        await dbConnect();
        const body = await request.json();
        const { name, avatarUrl } = body;

        if (typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'A name is required' }, { status: 400 });
        }

        // Fallback avatar handling using UI Avatars with Neon Blue styling
        const newAvatarUrl = typeof avatarUrl === 'string' && avatarUrl.trim() !== ''
            ? avatarUrl.trim()
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=020617&color=00f3ff&size=150`;

        const user = await User.create({ name: name.trim(), avatarUrl: newAvatarUrl });

        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            avatarUrl: user.avatarUrl
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/users failed:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
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

        const result = await User.deleteMany({ _id: { $in: ids } });
        return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('DELETE /api/users failed:', error);
        return NextResponse.json({ error: 'Failed to delete users' }, { status: 500 });
    }
}
