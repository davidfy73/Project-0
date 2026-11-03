// models/Progress.model.js
// Model catatan progres membaca materi Module & Preventive per user.

import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    completedSlugs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Progress', progressSchema);
