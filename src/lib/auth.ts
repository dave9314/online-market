import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Looking up user:", credentials.username)
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          })

          if (!user) {
            console.log("User not found:", credentials.username)
            return null
          }

          console.log("User found, checking password...")
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.username)
            return null
          }

          console.log("User authenticated successfully:", user.username)
          return {
            id: user.id,
            name: user.fullName,
            email: user.email || user.username,
            role: user.role,
          }
        } catch (error) {
          console.error("Error during authentication:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        console.log("JWT callback - user added to token:", user.id)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        console.log("Session callback - token added to session:", token.id)
      }
      return session
    }
  }
}
