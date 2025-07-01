import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use!" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    //save the user to stream chat
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`User saved to Stream ${newUser.fullName}`);
    } catch (error) {
      console.error("Error saving user to Stream:", error);
    }

    const userWithoutPassword = { ...newUser._doc };
    delete userWithoutPassword.password; // Remove password from response
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({
        success: true,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        success: true,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res
        .status(400)
        .json({
          error: "All fields are required",
          missingFields: [
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location",
          ].filter(Boolean),
        });
    }
  
    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true,
    }, {new: true})
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    //update the user in stream chat
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`User updated in Stream ${updatedUser.fullName}`);
    } catch (error) {
      console.error("Error updating user in Stream:", error);
    }

    const updatedUserWithoutPassword = { ...updatedUser._doc };
    delete updatedUserWithoutPassword.password; 
    res.status(200).json({success: true, user: updatedUserWithoutPassword });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
