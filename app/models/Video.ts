import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
    title: string;
    youtubeId: string;
    userIds: mongoose.Types.ObjectId[];
    location: string;
    date: string;
}

const VideoSchema: Schema = new Schema({
    title: { type: String, required: true },
    youtubeId: { type: String, required: true },
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    location: { type: String, required: true },
    date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
