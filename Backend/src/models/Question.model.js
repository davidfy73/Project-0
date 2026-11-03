// models/Question.model.js
// Model bank soal kuis PHISHYEARN.
// Dikelola mandiri oleh admin; tanpa seed otomatis.

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['module', 'preventive'],
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [
        (val) => Array.isArray(val) && val.length === 4,
        'Pilihan jawaban harus berjumlah tepat 4 opsi.',
      ],
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Question', questionSchema);
