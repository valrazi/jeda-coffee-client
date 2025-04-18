"use client"

import { formatRupiah } from "@/lib/formatter";
import { message, Input, Form, Button, InputNumber } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
export default function DetailProduct({ params }) {
    const [product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [note, setNote] = useState('')
    const [cart, setCart] = useCartContext()
    const [loading, setLoading] = useState(false)
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL
    const router = useRouter()
    const fetchDetail = async () => {
        try {
            const { id } = await params
            const data = await axios.get('/api/product/' + id)
            setProduct(data.data.data)
        } catch (error) {
            console.log(error);
            message.error('Fetch detail failed')
        }
    }
    const changeQty = async (action) => {
        if (action == 'plus') {
            if (quantity < product.stock) setQuantity(quantity + 1)
        } else if (action == 'minus') {
            if (quantity > 1) setQuantity(quantity - 1)
        }
    }
    const addToCart = async () => {
        setLoading(true)
        try {
            const data = await axios.post('/api/cart/add/' + cart.id, {
                product_id: product.id,
                quantity,
                note,
            })
            message.success('Item sucessfully added to cart!')
            setCart(data.data.data)
            router.push('/main')
        } catch (error) {
            console.log(error);
            message.error(error.response)
        } finally {
            setLoading(false)
        }
    }
    const toggleFavorite = async () => {
        setLoading(true)
        try {
            if(!product.favorites.length) {
                await axios.post('/api/favorite', {
                    product_id: product.id
                })
                message.success('Item added to favorites')
                await fetchDetail()
            }else {
                await axios.delete('/api/favorite?product_id=' + product.id)
                message.success('Item removed from favorites')
                await fetchDetail() 
            }
        } catch (error) {
            console.log(error);
            message.error(error.response)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchDetail()
    }, [])
    useEffect(() => {
        if (cart && cart.cart_items && product) {
            const itemFound = cart.cart_items.find((c) => c.product_id == product.id)
            console.log(itemFound);
            if (itemFound) {
                setQuantity(itemFound.quantity)
                setNote(itemFound.note)
            }
        }
    }, [cart, product])
    return (
        <div className="w-full h-full overflow-y-auto">
            <img className="object-cover h-60 aspect-square w-full" src={`${dashboardUrl}${product.image}`} />
            <div className="my-4 px-4 h-full overflow-y-auto">
                <h1 className="text-2xl font-bold">{product.name}</h1>

                <p className="text-xs">{formatRupiah(+product.price)}</p>
                <p className="text-sm text-gray-300 my-2">{product.description}</p>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Notes</label>
                    <Input.TextArea style={{ height: '100px' }} value={note} onChange={(e) => setNote(e.target.value)} />
                </div>

                <div className="w-full flex justify-between items-center mt-2">
                    <div>
                        <h2 className="text-xs text-gray-400">Total Price</h2>
                        <h1 className="font-bold">{formatRupiah(+product.price * quantity)}</h1>
                    </div>
                    <div className="flex gap-2 justify-center items-center my-2">
                        <Button icon={product.favorites && product.favorites.length ? <HeartFilled/> : <HeartOutlined/>} onClick={() => toggleFavorite()}/>
                        <Button icon={<MinusCircleOutlined />} onClick={() => changeQty('minus')} />
                        <InputNumber value={quantity} max={product.stock} min={0} disabled />
                        <Button icon={<PlusCircleOutlined />} onClick={() => changeQty('plus')} />
                    </div>
                </div>
                <div className="w-full flex justify-center items-center gap-4 my-2">
                    <Button loading={loading} onClick={() => addToCart()} style={{ width: '100%' }} variant="solid" color="gold">Add to Cart</Button>
                </div>
            </div>
        </div>
    )
}