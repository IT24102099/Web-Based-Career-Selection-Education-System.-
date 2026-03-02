import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user || null);
  } catch (e) {
    done(e, null);
  }
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      const name = profile.displayName || "Google User";
      const googleId = profile.id;

      if (!email) {
        return done(new Error("Google account did not return an email"), null);
      }

      // Link account by email if it exists
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          authProvider: "google",
          googleId
        });
      } else {
        // if user exists, attach google id if missing
        if (!user.googleId) user.googleId = googleId;
        if (user.authProvider === "local") {
          // keep local, but linked via googleId
        } else {
          user.authProvider = "google";
        }
        if (!user.name) user.name = name;
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
