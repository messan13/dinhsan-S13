import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials"; 
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers:[
      CredentialsProvider({
        name:'Credentials',
        credentials:{
          name:{label:'name',type:"text", placeholder:"nhập tên"},
          password :{label:"password",type:"password" , placeholder:'nhập password'},
        },
        async authorize(credentials){
          if (!credentials || !credentials.name || !credentials.password) {
            throw new Error("Thiếu thông tin đăng nhập");
          }
          const data = await prisma.user.findFirst({
            where: { name: credentials.name },
          });
          if (!data) {
            throw new Error("Người dùng không tồn tại");
          }
          const isPasswordValid = await bcrypt.compare(credentials.password, data.password);
          if (!isPasswordValid) {
            throw new Error("Mật khẩu không chính xác!");
          }
        return {
          id:data.id.toString(),
          name:data.name,
          email:data.email,
          checkAdmin : data.checkAdmin
        }
        },
      }),
  ],
  session: {
    strategy:"jwt",
    maxAge: 60*30,
    updateAge: 60*20
  },
  jwt :{
    maxAge:60*30
  },
  pages:{
    signIn : "auth/SignIn"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.name = user.name;
        token.email = user.email;
        token.checkAdmin = user.checkAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; 
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.checkAdmin = token.checkAdmin as boolean;
      }
      return session;
    },
  },
})