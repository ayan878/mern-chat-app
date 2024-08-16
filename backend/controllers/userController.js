// import bcrypt from "bcryptjs";
// import { User } from "../models/userModel.js";
// import jwtToken from "jsonwebtoken";

// // User Registration
// export const register = async (req, res) => {
//   try {
//     const { fullName, username, password, confirmPassword, gender } = req.body;

//     // Check if all required fields are provided
//     if (!fullName || !username || !password || !confirmPassword || !gender) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Check if username already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "Username already exists. Please try a different one.",
//       });
//     }

//     // Hash the password
//     const hashPassword = await bcrypt.hash(password, 10);

//     // Determine the profile photo URL
//     const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
//     const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
//     const userProfilePhoto =
//       gender === "male" ? maleProfilePhoto : femaleProfilePhoto;

//     // Create the new user
//     const newUser = await User.create({
//       fullName,
//       username,
//       password: hashPassword,
//       profilePhoto: userProfilePhoto,
//       gender,
//     });

//     // Send success response
//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         fullName: newUser.fullName,
//         profilePhoto: newUser.profilePhoto,
//         gender: newUser.gender,
//       },
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "An error occurred during registration" });
//   }
// };

// // User Login
// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Validate input
//     if (!username || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if user exists
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({
//         message: "Incorrect username or password",
//         success: false,
//       });
//     }

//     // Compare password
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         message: "Incorrect username or password",
//         success: false,
//       });
//     }

//     // Generate JWT token
//     const tokenData = { userId: user._id };
//     const token = jwtToken.sign(tokenData, process.env.JWT_SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     // Set cookie and respond
//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
//         httpOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         _id: user._id,
//         username: user.username,
//         fullName: user.fullName,
//         profilePhoto: user.profilePhoto,
//       });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "An error occurred during login" });
//   }
// };

// // User Logout
// export const logout = async (req, res) => {
//   try {
//     return res
//       .status(200)
//       .cookie("token", "", { maxAge: 0 }) // Clear the cookie
//       .json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     res.status(500).json({ message: "An error occurred during logout" });
//   }
// };

// // Get Other Users
// export const getOtherUsers = async (req, res) => {
//   try {
//     const loggedInUserId = req.userId; // Assuming req.userId contains the logged-in user's ID

//     // Find all users except the logged-in user
//     const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
//       "-password"
//     );

//     // Return the list of other users
//     res.status(200).json(otherUsers);
//   } catch (error) {
//     console.error("Error fetching other users:", error);
//     res.status(500).json({ message: "An error occurred while fetching users" });
//   }
// };

import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "Username already exit try different" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // profilePhoto
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    await User.create({
      fullName,
      username,
      password: hashedPassword,
      profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
      gender,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
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
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
      });
  } catch (error) {
    console.log(error);
  }
};
export const logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};
export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    return res.status(200).json(otherUsers);
  } catch (error) {
    console.log(error);
  }
};