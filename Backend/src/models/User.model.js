// models/User.model.js
// Model user PHISHYEARN.
// passwordHash dan refreshTokenHash tidak pernah keluar di respons
// (select: false + transform toJSON sebagai lapisan ganda).

import mongoose from 'mongoose';

// Konstanta cost bcrypt — dipakai di controller DAN seed admin.
// Hash dummy untuk timing-safe login juga memakai cost yang sama.
export const BCRYPT_COST = 12;

const userSchema = new mongoose.Schema(
  {
    // username menyimpan casing asli untuk ditampilkan
    username: {
      type: String,
      required: true,
      trim: true,
    },
    // usernameLower dipakai untuk cek keunikan case-insensitive
    usernameLower: {
      type: String,
      required: true,
      unique: true,   // index unik di level database
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,  // tidak keluar kecuali diminta eksplisit: .select('+passwordHash')
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false,  // tidak keluar kecuali diminta eksplisit: .select('+refreshTokenHash')
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

// Lapisan ganda: hapus field sensitif dari output JSON
// (berlaku meski select: false terlewat di suatu query)
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
