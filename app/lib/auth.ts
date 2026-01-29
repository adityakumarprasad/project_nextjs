import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "../model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Invalid Credentials");
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new Error("User not found");
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid Password");
        }

        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image
        };
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],

  callbacks: {

    async signIn({ user, account

    }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user?.email });;
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name as string,
            email: user.email as string,
          });
        }
        user.id = existingUser?._id as string;
      } 
      return true;
    },

    async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.image = user.image;
          }
          return token;
        },

    async session({ session, token }) {
          if (session.user) {
            session.user.id = token.id as string;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.image as string;
          }
          return session;
        }
      },
      session: {
        strategy: "jwt",
          maxAge: 30 * 24 * 60 * 60,
  },

      pages: {
        signIn: "/login",
          error: "/login",

  },
      secret: process.env.NEXTAUTH_SECRET
    };

    export default authOptions;
