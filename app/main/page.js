"use client"

import { Button, Empty, message, Row, Tag, Select, InputNumber } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { formatRupiah } from '@/lib/formatter'
import { ShoppingCartOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, DeleteOutlined, HeartFilled } from '@ant-design/icons'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCartContext } from "@/context/CartContext"
const { OptGroup } = Select
export default function MainPage() {
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL
    const [products, setProducts] = useState([])
    const [subcategories, setSubcategories] = useState({})
    const [cart, setCart] = useCartContext()
    const router = useRouter()
    const [query, setQuery] = useState({
        subcategory: undefined,
        Search: undefined,
    })
    const fetchProducts = async () => {
        try {
            let data = await axios.get('/api/product', {
                params: query
            });
            if (cart) {
                data = data.data.data.map((c) => {
                    const isExist = cart.cart_items.find((i) => i.product_id == c.id);
                    if (isExist) {
                        c.is_exist = true
                        c.on_cart = isExist.quantity
                    }
                    else {
                        c.is_exist = false
                        c.on_cart = 0
                    }
                    return c
                })
            }
            setProducts(data)
        } catch (error) {
            console.log(error);
            message.error('Fetch product failed!')
        }
    }

    const fetchSubcategories = async () => {
        try {
            const data = await axios.get('/api/subcategory')
            setSubcategories(data.data.data)
        } catch (error) {
            console.log(error);
            message.error('Fetch Subcategories Failed')
        }
    }

    const handleSubcategory = async (values) => {
        setQuery({
            Search: undefined,
            subcategory: values
        })
    }

    const changeQty = async (action, product) => {
        if (action == 'plus') {
            console.log('hot');
            if (product.on_cart < product.stock) {
                await addToCart(product.on_cart + 1, product)
            }
        } else if (action == 'minus') {
            if (product.on_cart > 0) {
                await addToCart(product.on_cart - 1, product)
            }
        }
    }

    const addToCart = async (quantity, product) => {
        try {
            const data = await axios.post('/api/cart/add/' + cart.id, {
                product_id: product.id,
                quantity,
            })
            message.success('Item sucessfully added to cart!')
            setCart(data.data.cart)
        } catch (error) {
            console.log(error);
            message.error(error.response)
        } finally {
        }
    }

    const deleteItem = async (product) => {
        try {
            const cartItem = cart.cart_items.find((c) => c.product_id == product.id)
            const data = await axios.post('/api/cart/delete/' + cart.id, {
                cart_item_id: +cartItem.id,
            })
            message.success('Item sucessfully removed from cart!')
            setCart(data.data.cart)
        } catch (error) {
            console.log(error);
            message.error(error.response)
        } finally {
        }
    }

    useEffect(() => {
        fetchSubcategories()
    }, [])

    useEffect(() => {
        if (cart && cart.cart_items) {
            fetchProducts()
        }
        console.log(cart);
    }, [cart, query])

    return (
        <div className="flex flex-col gap-1 p-4">
            {
                subcategories && (
                    <div className="w-full flex flex-col gap-2">
                        <h1 className="border-b-2 border-gray-200 text-center"><strong>JEDA</strong><br></br><span className="italic font-extralight">Jembatan Doa</span></h1>
                        <Select allowClear onChange={handleSubcategory} style={{ width: '100%' }} placeholder="Subcategory">
                            {Object.keys(subcategories).map((category) => (
                                <Select.OptGroup key={category} label={category}>
                                    {Array.isArray(subcategories[category]) && subcategories[category].map((item) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select.OptGroup>
                            ))}
                        </Select>
                    </div>
                )
            }
            {
                products.length ? (
                    products.map((p) => {
                        return (
                            <div className="border-b border-gray-200 p-2 flex gap-2" key={p.id}>
                                <img src={`${dashboardUrl}${p.image}`} className="max-w-18 min-w-18 object-cover shrink-0 grow-0 h-fit rounded-lg aspect-square" />
                                <div className="w-full">
                                    {/* <span className="shrink-0 grow-0 w-fit rounded-xl text-white py-0.5 px-2 text-[8px] bg-black/70 flex justify-center items-center gap-1">{p.category}</span> */}
                                    <Row>
                                        <Tag color="#2b2b2b" >{p.category}</Tag>
                                        {
                                            p.subcategory && (
                                                <Tag color="#807d7d" >{p.subcategory.name}</Tag>
                                            )
                                        }
                                    </Row>
                                    <h1 className="text-xs font-bold mt-1">{p.name}</h1>
                                    <p className="text-[8px] text-gray-300 line-clamp-2">{p.description}</p>
                                    {
                                        (p.favorites && p.favorites.length > 0) && (
                                            <div className="flex gap-2 items-center my-1">
                                                <HeartFilled style={{color: 'red', fontSize: '12px'}}/>
                                                <p className="text-xs text-gray-300">{p.favorites.length} Likes </p>
                                            </div>
                                        )
                                    }
                                    <div className="w-full flex justify-between items-center">
                                        <p className="text-xs">{formatRupiah(+p.price)}</p>
                                        <div className="flex gap-2 items-center">
                                            {
                                                p.is_exist && (
                                                    <div className="flex gap-2 justify-center items-center my-2">
                                                        {
                                                            p.on_cart > 1 ?
                                                                <Button icon={<MinusCircleOutlined />} onClick={() => changeQty('minus', p)} /> :
                                                                <Button icon={<DeleteOutlined />} onClick={() => deleteItem(p)} />
                                                        }
                                                        <InputNumber style={{ width: '50px' }} value={p.on_cart} max={p.stock} min={0} disabled />
                                                        <Button icon={<PlusCircleOutlined />} onClick={() => changeQty('plus', p)} />
                                                    </div>
                                                )
                                            }
                                            <Button size="small" type="primary" variant="solid" color="default" >
                                                <Link href={`/main/product/${p.id}`} >
                                                    {
                                                        p.is_exist
                                                            ?
                                                            <span className="relative text-xs flex items-center justify-center gap-2">
                                                                <EditOutlined />
                                                                Edit
                                                                <span className="text-[8px] rounded-full bg-red-700 flex justify-center items-center w-4 h-4 absolute -top-3 -right-4">{p.on_cart}</span>
                                                            </span>
                                                            :
                                                            <span className="text-xs flex items-center justify-center gap-2">
                                                                < ShoppingCartOutlined />
                                                                Add
                                                            </span>
                                                    }
                                                </Link>
                                            </Button>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <Empty />
                )
            }
        </div>
    )
}