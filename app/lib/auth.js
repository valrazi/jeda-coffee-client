import CredentialsProvider from "next-auth/providers/credentials";
import User from '../../models/user'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
      signIn: '/auth/sign-in'
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", required: true },
          password: { label: "Password", type: "password", required: true },
        },
        async authorize(credentials) {
          const user = await User.findOne({ where: { email: credentials.email } });
          if (!user) throw new Error("No user found");
  
          const isValid = bcrypt.compareSync(credentials.password, user.password);
          
          if (!isValid) {
            const isValidMd5 = crypto.createHash('md5').update(credentials.password).digest('hex')
            console.log({isValidMd5: isValidMd5 == user.password});
            if(isValidMd5 != user.password) {
              throw new Error("Invalid credentials");
            }
          } 
  
          return { id: user.id, name: user.name, email: user.email };
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) token.id = user.id;
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        return session;
      }
    },
  };
  