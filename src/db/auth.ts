import { JWT } from "next-auth/jwt";

import { Session, NextAuthOptions, User } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { LoginSchema } from "@/types/login-schema";

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      // Use GoogleProvider instead of Google
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .then((res) => res[0]); // Drizzle returns an array

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          return user;
        } else {
          throw new Error("Incorrect password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.user) {
        session.user = {
          id: (token.user as User).id,
          name: (token.user as User).name,
          email: (token.user as User).email,
          image: (token.user as User).image,
        };
      }
      return session;
    },
  },
};
