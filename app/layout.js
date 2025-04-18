import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { CartProvider } from "./context/CartContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export const metadata = {
  title: "Jeda Kopi",
  description: "Jeda Kopi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} var(--font-poppins) antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
