import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
    videoId: mongoose.Types.ObjectId;
    url: string;
}

const PhotoSchema: Schema = new Schema({
    videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    url: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
