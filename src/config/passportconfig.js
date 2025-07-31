import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js"; // ✅ Use capital U for clarity

// ✅ Local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const existingUser = await User.findOne({ username }); // ✅ No conflict
    if (!existingUser) return done(null, false, { message: "User not found" });

    const isMatch = await bcrypt.compare(password, existingUser.password); // ✅ fixed typo
    if (isMatch) return done(null, existingUser);
    else return done(null, false, { message: "Incorrect password" });

  } catch (error) {
    return done(error);
  }
}));

// ✅ Serialize user into session
passport.serializeUser((user, done) => {
  console.log("✅ Inside serializeUser");
  done(null, user._id);
});

// ✅ Deserialize user from session
passport.deserializeUser(async (_id, done) => {
  try {
    console.log("✅ Inside deserializeUser");
    const user = await User.findById(_id); // ✅ 'User', not 'user'
    done(null, user);
  } catch (error) {
    done(error);
  }
});
