import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        name: { label: "name", type: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        console.log(user);

        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              fullname: credentials.name,
              email: "",
              password: await bcrypt.hash(credentials.password, 10),
              username: credentials.username,
              roleId: 1,
            },
          });
          return {
            id: String(newUser.id),
            fullname: newUser.fullname,
            email: newUser.email,
            username: newUser.username,
          };
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          return null;
        }
        console.log("id: ", user.id, "fullname: ", user.fullname);

        return {
          id: String(user.id),
          name: user.fullname,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return {
        ...token,
        id: token.id ?? user?.id,
        name: token.name ?? user?.name,
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.id, name: token.name },
      };
    },
  },
} satisfies NextAuthOptions;
