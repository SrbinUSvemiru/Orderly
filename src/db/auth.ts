import { NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { LoginSchema } from "@/types/login-schema";
import { User } from "@/types/user";

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
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as User;
        token.user = {
          id: customUser.id,
          name: customUser.name,
          email: customUser.email,
          image: customUser.image,
          firstName: customUser.firstName,
          lastName: customUser.lastName,
          createdAt: customUser.createdAt,
          updatedAt: customUser.updatedAt,
          deletedAt: customUser.deletedAt,
          active: customUser.active,
          organizationId: customUser.organizationId,
          phone: customUser.phone,
          type: customUser.type,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const customUser = token.user as User;
        session.user = {
          id: customUser.id,
          name: customUser.name,
          email: customUser.email,
          image: customUser.image,
          firstName: customUser.firstName,
          lastName: customUser.lastName,
          createdAt: customUser.createdAt,
          updatedAt: customUser.updatedAt,
          deletedAt: customUser.deletedAt,
          active: customUser.active,
          organizationId: customUser.organizationId,
          phone: customUser.phone,
          type: customUser.type,
        };
      }
      return session;
    },
  },
};
