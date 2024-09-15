// the file structure is mandated by auth.js
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions);