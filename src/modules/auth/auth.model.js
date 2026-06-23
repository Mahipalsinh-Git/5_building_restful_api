import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// mongoose middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password"));
  this.password = await bcrypt.hash(this.password, 12); // salt number between 8 to 12
});

// compare password - bcrypt
userSchema.methods.comparePassword = async function (clearTextPassword) {
  return bcrypt.compare(clearTextPassword, this.password);
};

export default mongoose.model("User", userSchema);

// inDB - User always in lowercase and convert into purals
// eg. users
