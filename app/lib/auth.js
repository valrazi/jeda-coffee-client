import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import Customer from "../../models/customer";
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
          const customer = await Customer.findOne({ where: { email: credentials.email } });
          if (!customer) throw new Error("No user found");
  
          const isValid = bcrypt.compareSync(credentials.password, customer.password);
          
          if (!isValid) {
            throw new Error("Invalid credentials");
          } 
  
          return { id: customer.id, name: customer.full_name, email: customer.email, phone_number: customer.phone_number, kota_asal: customer.kota_asal };
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name
          token.email = user.email
          token.kota_asal = user.kota_asal
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        session.user.name = token.name; 
        session.user.email = token.email
        session.user.kota_asal= token.kota_asal
        return session;
      }
    },
  };
  