import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const {
      fullName,
      username,
      password,
      confirmPassword,
      gender,
      profilePhoto,
    } = req.body;

    // Check if all required fields are provided
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if username already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: "Username already exists. Please try a different one.",
      });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Determine the profile photo URL
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const userProfilePhoto =
      gender === "male" ? maleProfilePhoto : femaleProfilePhoto;

    // Create the new user
    await User.create({
      fullName,
      username,
      password: hashPassword,
      profilePhoto: userProfilePhoto,
      gender,
    });

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password", success: false });
    }
  
  } catch (error) {
    res.status(500).json({ message: `An ${error} occurred during login` });
    
  }
};
