import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    avatarUrl: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
