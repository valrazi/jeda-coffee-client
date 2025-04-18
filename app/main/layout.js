"use client";
import { SessionProvider } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import '@ant-design/v5-patch-for-react-19';
import { Button, message } from "antd";
import { UserOutlined, ShoppingCartOutlined, OrderedListOutlined, HomeOutlined } from '@ant-design/icons'
import Swal from "sweetalert2";
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import axios from "axios";
import Link from "next/link";
export default function MainLayout({ children }) {
  const router = useRouter()
  const pathName = usePathname()
  const [cart, setCart] = useCartContext()// Fetch NextAuth session

  // let titleName = 'PM Report'
  // switch (usePathname()) {
  //     case '/main':
  //         titleName = 'Jeda Coffee'
  //         break;
  // }
  const fetchCart = async () => {
    try {
      const data = await axios.get('/api/cart/customer')
      setCart(data.data.data)
    } catch (error) {
      console.log(error);
      message.error('Failed fetch cart')
    }
  }

  useEffect(() => {
    fetchCart()
  }, [pathName])
  const signoutConfirmation = () => {
    Swal.fire({
      icon: 'question',
      title: 'Want to Signout?',
      showCancelButton: true
    })
      .then(async (res) => {
        if (res.isConfirmed) {
          await signOut({ callbackUrl: '/', redirect: true })
        }
      })
  }
  return <SessionProvider>
    <div className="w-full h-dvh  flex justify-center font-poppins">
      <div className=" w-full flex flex-col">

        <header className="w-full bg-white flex justify-between items-center p-4 border-b-2 border-b-gray-100">
          <Link href={'/main'}>
            <img
              src="/logo.png"
              className="w-24 cursor-pointer"
              alt="Logo"
            />
          </Link>
          <Button className="text-white" type="default" variant="solid" color="default" onClick={signoutConfirmation}>
            Logout
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto  bg-white">
          {children}
        </main>

        <footer className="w-full bottom-0 left-0 right-">
          {
            (cart && cart.cart_items && cart.cart_items.length && pathName == '/main') && (
              <div onClick={() => {
                router.push('/main/cart')
              }} className="w-1/2 hover:cursor-pointer bg-black text-white rounded-xl mb-2 flex px-4 py-2  m-auto justify-between">
                <h1>{cart.cart_items.length} Item</h1>
                <h1>Rp.{cart.total_price}</h1>
              </div>
            )
          }
          <div className="flex justify-around py-3 bg-black text-white">

            <Link href={`/main/`}>
              <span className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <HomeOutlined />
                <span className={pathName == '/main' ? 'rounded-sm border-b-4 border-red-400' : ''} >Home</span>
              </span>
            </Link>


            <Link href={`/main/cart`}>
              <span className="relative flex flex-col items-center justify-center gap-1 cursor-pointer">
                <ShoppingCartOutlined />
                <span className={pathName == '/main/cart' ? 'rounded-sm border-b-4 border-red-400' : ''}>Cart</span>
                <span className="absolute -right-4 -top-1 bg-red-700 w-4 h-4 shrink-0 grow-0 text-center rounded-full flex items-center justify-center text-white text-[8px]">
                  {
                    (cart && !Array.isArray(cart) && cart.cart_items.length) && cart.cart_items.length
                  }
                </span>
              </span>
            </Link>

            <Link href={`/main/order`}>
              <span className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <OrderedListOutlined />
                <span className={pathName == '/main/order' ? 'rounded-sm border-b-4 border-red-400' : ''}>Orders</span>
              </span>
            </Link>

            <Link href={`/main/profile`}>
              <span
                style={{

                }}
                className="relative flex flex-col items-center justify-center gap-1 cursor-pointer">
                <UserOutlined />
                <span className={pathName == '/main/profile' ? 'rounded-sm border-b-4 border-red-400' : ''}>Account</span>
              </span>
            </Link>

          </div>
        </footer>
      </div>
    </div >
  </SessionProvider >
}
