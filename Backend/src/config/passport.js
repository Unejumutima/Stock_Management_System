import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './env.js'
import * as userModel from '../models/user.model.js'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.getUserById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(null, false, { message: 'No email returned from Google' })
        }

        // 1. Check if user already exists by Google ID
        let user = await userModel.getUserByGoogleId(profile.id)
        if (user) {
          if (!user.is_approved) {
            return done(null, false, { message: 'not_approved' })
          }
          return done(null, user)
        }

        // 2. Check if user exists by email (admin pre-registered them)
        user = await userModel.getUserByEmail(email)
        if (user) {
          if (!user.is_approved) {
            return done(null, false, { message: 'not_approved' })
          }
          // Link their Google ID to the existing account
          user = await userModel.updateUser(user.id, { googleId: profile.id })
          return done(null, user)
        }

        // 3. Email not pre-registered — create account but mark as not approved
        //    Admin will need to approve them in User Management
        await userModel.createUser({
          email,
          fullName: profile.displayName || `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`.trim(),
          role: 'user',
          googleId: profile.id,
          isApproved: false,
        })

        return done(null, false, { message: 'not_approved' })
      } catch (err) {
        return done(err, null)
      }
    },
  ),
)

export default passport
