// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password, user.password);
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

       //If user has no name then use the email
       if (user.name === 'NO_NAME') {
        token.name = user.email?.split('@')[0] ?? 'guest'

       // Update database to reflect the token name
        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name },
         })
        }
      }
      return token;
    },

    async session({ session, token, user, trigger }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
       console.log(token) 

      if (trigger === "update" && user?.name) {
        session.user.name = user.name;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
