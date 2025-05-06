"use client"
import CheckoutModal from "@/components/Cart/checkout.modal"
import { useCartContext } from "@/context/CartContext"
import { formatRupiah } from "@/lib/formatter"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Empty, message } from "antd"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation'
export default function CartPage({ }) {
    const [cart, setCart] = useCartContext()
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [isPaidCashier, setIsPaidCashier] = useState(false)
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL

    const deleteCartItem = async (cart_item_id) => {
        try {
            const data = await axios.post(`/api/cart/delete/${cart.id}`, {
                cart_item_id
            })
            setCart(data.data.cart)
            message.success('Item removed succesfully')
        } catch (error) {
            console.log(error);
            message.error(error.response.data.error)
        }
    }

    const initCheckout = async () => {
        setIsPaidCashier(false)
        setShowModal(true)
    }
    const initPaidCashier = async () => {
        setIsPaidCashier(true)
        setShowModal(true)
    }
    const finishCheckout = () => {
        router.push('/main/order')
    }
    return (
        (cart && cart.cart_items && cart.cart_items.length) ? (
            <div className="px-4 h-full overflow-y-auto">

                <CheckoutModal isPaidCashier={isPaidCashier} showModal={showModal} setShowModal={setShowModal} finishCheckout={finishCheckout} />
                {
                    cart.cart_items.map((p) => {
                        return (
                            <div className="border-b border-gray-200 p-2 flex gap-2" key={p.id}>
                                <img src={`${dashboardUrl}${p.product.image}`} className="max-w-18 min-w-18 object-cover shrink-0 grow-0 h-fit rounded-lg aspect-square" />
                                <div className="w-full">
                                    <h1 className="text-xs font-bold mt-1">{p.product.name}</h1>
                                    <p className=" text-gray-400 text-[8px]">Note: </p>
                                    <p className="text-[8px] text-gray-400 mb-1">{p.note}</p>
                                    <div className="w-full flex justify-between items-center">
                                        <div>
                                            <p className=" font-bold text-[8px]">Total Price: </p>
                                            <p className="text-xs font-bold">{formatRupiah(+p.total_price)}</p>
                                        </div>
                                        <div className=" flex gap-2">
                                            <Button onClick={() => deleteCartItem(p.id)} size="small" type="primary" variant="solid" color="red" >
                                                <span className="relative text-xs flex items-center justify-center gap-2">
                                                    <DeleteOutlined />
                                                    Delete
                                                </span>
                                            </Button>
                                            <Button size="small" type="primary" variant="solid" color="default" >
                                                <Link href={`/main/product/${p.product.id}`} >
                                                    <span className="relative text-xs flex items-center justify-center gap-2">
                                                        <EditOutlined />
                                                        Edit
                                                        <span className="text-[8px] rounded-full bg-red-700 flex justify-center items-center w-4 h-4 absolute -top-3 -right-4">{p.quantity}</span>
                                                    </span>
                                                </Link>
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            </div>


                        )
                    })
                }


                <div className="w-full border border-gray-300 mt-4 mb-4  z-[999]  rounded-xl py-1 px-4 text-black">
                    <div className="w-full flex justify-between mb-2 items-center text">
                        <h1 className="text-sm  font-bold">Total Price</h1>
                        <h2 className="text-sm  font-bold">{formatRupiah(cart.total_price)}</h2>
                    </div>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-2">
                    <Button onClick={initCheckout} style={{ width: '100%' }} variant="solid" color="default">Checkout</Button>

                    <Button onClick={initPaidCashier} style={{ width: '100%' }} variant="solid" color="blue">Bayar di Kasir</Button>
                </div>
            </div>
        ) :
            (
                <div className="my-4">
                    <Empty />
                </div>
            )
    )
}