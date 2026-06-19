import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      maxlength: 50,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"], // access for constant file
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false, // don't return this field when res send
    },
    refreshToken: {
      type: String,
      select: false, // don't return this field when res send
    },
    resetPasswordToken: {
      type: String,
      select: false, // don't return this field when res send
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // don't return this field when res send
    },
  },
  { timestamps: true }, // byDefault set createdAt, and updatedAt
);

export default mongoose.model("User", userSchema);

// inDB - User always in lowercase and convert into purals
// eg. users
