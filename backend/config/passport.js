import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '../models/User.js'
import crypto from 'crypto'

// Initialize passport strategies. This module executes on import.

// Helper to find or create user from provider profile
const findOrCreateUser = async ({ email, name, avatar }) => {
  if (!email) return null

  let user = await User.findOne({ email })
  if (user) {
    // Update avatar/name when missing
    const needsUpdate = (avatar && !user.avatar) || (name && !user.name)
    if (needsUpdate) {
      if (avatar) user.avatar = avatar
      if (name) user.name = name
      await user.save()
    }
    return user
  }

  // Create new user with random password
  const randomPassword = crypto.randomBytes(20).toString('hex')
  user = await User.create({
    name: name || 'Người Dùng',
    email,
    password: randomPassword,
    avatar: avatar || null
  })
  return user
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const callbackURL = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  console.log('✅ Registering Google OAuth Strategy')
  console.log('📧 Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...')
  console.log('🔗 Callback URL:', callbackURL)
  console.log('⚠️  Make sure this URL is added to Google Cloud Console -> Authorized redirect URIs')
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value
      const name = profile.displayName
      const avatar = profile.photos && profile.photos[0] && profile.photos[0].value
      const user = await findOrCreateUser({ email, name, avatar })
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }))
} else {
  console.log('❌ Google OAuth NOT configured - Missing credentials')
  console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Found' : 'MISSING')
  console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Found' : 'MISSING')
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value
      const name = profile.displayName
      const avatar = profile.photos && profile.photos[0] && profile.photos[0].value
      const user = await findOrCreateUser({ email, name, avatar })
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }))
}

export default passport
