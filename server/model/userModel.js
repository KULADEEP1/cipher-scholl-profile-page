import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  salt: {
    type: String,
    required: true,
    select: false,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
  },
  facebook: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  instagram: {
    type: String,
  },
  website: {
    type: String,
  },
  twitter: {
    type: String,
  },
  education: {
    type: String,
  },
  currentProf: {
    type: String,
  },
  interests: [
    {
      type: String,
    },
  ],
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");

  return this.password === hash;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
