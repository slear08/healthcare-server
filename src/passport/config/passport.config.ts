import passport from 'passport';
import {
  Profile as GoogleProfile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';

import USER_TYPE from '../../constant/user_type.constant';
import User, { UserInterface } from '../../models/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (
      _req: Express.Request,
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      cb: VerifyCallback
    ) => {
      try {
        const existingUser = await User.findOne({ _id: profile.id });

        if (existingUser) {
          return cb(null, existingUser);
        } else {
          const newUser = new User({
            _id: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            role: USER_TYPE.USER,
            isVerified: false,
            profile: profile.photos?.[0]?.value,
          });
          await newUser.save();

          return cb(null, newUser);
        }
      } catch (error) {
        console.log('==========================================');
        console.log('ERROR', error);
        console.log('==========================================');
        return cb(error as Error);
      }
    }
  )
);

passport.serializeUser((serializeUser, done) => {
  const user = serializeUser as UserInterface;
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user as UserInterface);
  } catch (error) {
    done(error);
  }
});

export default passport;
