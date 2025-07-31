import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Check for duplicate user
    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newuser = new user({
      username,
      password: hashedpassword,
      isMfaActive: false,
    });

    console.log("✅ New user:", newuser);
    await newuser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration failed:", error);
    res.status(500).json({ error: "Error registering user", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("✅ Authenticated user:", req.user);
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } catch (err) {
    console.error("❌ Login controller failed:", err);
    res.status(500).json({ message: "Unexpected login error" });
  }
};

export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User is authenticated",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

export const logout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(400).json({ message: "User not logged in" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};

export const setup2FA = async (req, res) => {
  try {
    const currentUser = req.user;
    const secret = speakeasy.generateSecret();

    currentUser.twoFactorSecret = secret.base32;
    currentUser.isMfaActive = true;
    await currentUser.save();

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${currentUser.username}`,
      issuer: "www.devgoswami.com",
      encoding: "base32",
    });

    const qrimageurl = await qrCode.toDataURL(otpAuthUrl);

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrimageurl,
    });
  } catch (error) {
    console.error("❌ Setup 2FA failed:", error);
    res.status(500).json({ error: "Error setting up 2FA", message: error.message });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const currentUser = req.user;

    const verified = speakeasy.totp.verify({
      secret: currentUser.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      const jwtToken = jwt.sign(
        { username: currentUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "2FA successful", token: jwtToken });
    } else {
      res.status(400).json({ message: "Invalid 2FA code" });
    }
  } catch (error) {
    console.error("❌ Verify 2FA failed:", error);
    res.status(500).json({ error: "Error verifying 2FA", message: error.message });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const currentUser = req.user;
    currentUser.twoFactorSecret = "";
    currentUser.isMfaActive = false;
    await currentUser.save();

    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    console.error("❌ Reset 2FA failed:", error);
    res.status(500).json({ error: "Error resetting 2FA", message: error.message });
  }
};
