// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { compare } from "bcryptjs";
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
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isMatch = await compare(credentials.password, user.password);
        if (!isMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // Generate name if missing
        if (!user.name || user.name === "NO_NAME") {
          const generatedName = user.email?.split("@")[0] ?? "guest";
          token.name = generatedName;
    
          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: generatedName },
          });
        } else {
          token.name = user.name;
        }
      }
      
      // Handle session updates
      if (trigger === "update" && session?.user.name) {
        token.name = session.user.name;
      }

      return token;
    },

    async session({ session, token, user, trigger }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }

      if (trigger === "update" && user?.name) {
        session.user.name = user.name;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
