import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email'
import { fetchRedis } from '@/helpers/redis'

function getAppleCredentials() {
  const clientId = process.env.APPLE_CLIENT_ID
  const clientSecret = process.env.APPLE_CLIENT_SECRET

  if (!clientId) {
    throw new Error('Missing APPLE_CLIENT_ID')
  }

  if (!clientSecret) {
    throw new Error('Missing APPLE_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}

function getFacebookCredentials() {
  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET

  if (!clientId) {
    throw new Error('Missing FACEBOOK_CLIENT_ID')
  }

  if (!clientSecret) {
    throw new Error('Missing FACEBOOK_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if (!clientSecret) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
  // adds data to db directly
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    AppleProvider({
      clientId: getAppleCredentials().clientId,
      clientSecret: getAppleCredentials().clientSecret,
    }),
    FacebookProvider({
      clientId: getFacebookCredentials().clientId,
      clientSecret: getFacebookCredentials().clientSecret
    }),
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    EmailProvider({
      server: process.env.MAIL_SERVER,
      from: 'NextAuth.js <no-reply@example.com>'
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id
        }

        return token
      }

      const dbUser = JSON.parse(dbUserResult) as User

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    redirect() {
      return '/dashboard'
    },
  },
}