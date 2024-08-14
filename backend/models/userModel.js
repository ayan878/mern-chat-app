import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  fullName: { type: String, require: true },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: { type: String, require: true },
  profilePhoto: { type: String, require: true ,default:""},
  gender: { type: String,enum:["male,female"] },
});

export const User=mongoose.Model('User',userModel)
