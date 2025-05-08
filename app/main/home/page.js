"use client"

import './css/style.css'
import { Button, Empty, message, Row, Tag, Select, InputNumber, Spin } from "antd"
import { Fade } from 'react-awesome-reveal'
import axios from "axios"
import { useEffect, useState } from "react"
import { formatRupiah } from '@/lib/formatter'
import { ShoppingCartOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, DeleteOutlined, HeartFilled } from '@ant-design/icons'
import { useRouter } from "next/navigation"
import Link from "next/link"
import Swal from "sweetalert2"
import { signOut } from "next-auth/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot, faMinus, faMugHot, faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
const { OptGroup } = Select
export default function MainPage() {
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL
    const [products, setProducts] = useState([])
    const router = useRouter()
    const [query, setQuery] = useState({
        subcategory: undefined,
        Search: undefined,
    })
    const [isLoading, setIsLoading] = useState(false)
    const arrTestimoni = [
        {
            name: 'Nurul Fujairah',
            description: 'Suasana nya buat nugas sambil ngopi enak,pelayanan nya ramah sekali baristanya,minumannya jg rekomend bgt dgn harga terjangkau di semua kalangan.'
        },
        {
            name: 'Shinta Oktora',
            description: 'Harga terjangkau sekali,makananya menarik,minumannya enak2 ,di kasih tau lagi rekomendasi dr baristanya.Uniknya ada membernya gitu ,juga punya secret menu aku suka.'
        },
        {
            name: 'Diah Setyorini',
            description: 'Coffe gulan aren nya TOP Tempatnya artistik, enak banget tuk kongkow - kongkow'
        },
    ]
    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            let data = await axios.get('/api/product', {
                params: {
                    ...query,
                    limit: 4,
                    orderBy: 'favoriteCount',
                    order: 'desc'
                }
            });
            data = data.data.data.map((c) => {
                c.is_exist = false
                c.on_cart = 0
                return c
            })
            setProducts(data)
        } catch (error) {
            console.log(error);
            message.error('Fetch product failed!')
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchProducts()
    }, [query])

    const navigateToMenu = () => {
        document.getElementById('menu-list')?.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <div className="w-full flex flex-col h-full" key={'hero-home'}>
            {
                isLoading ? (
                    <Spin />
                ) : (
                    <div className="flex flex-col gap-4 ">
                        <div className="w-full flex flex-col gap-2 bg-hero min-h-[400px] max-h-[400px] ">
                            <div className='w-full min-h-[400px] max-h-[400px] bg-black/60 flex justify-center items-center flex-col gap-2'>
                                <h1 className="text-center text-white text-4xl border-b">
                                    <strong>JEDA</strong><br />
                                    <span className="font-extralight">Jembatan Doa</span>
                                </h1>
                                <h1 className='text-white font-extralight flex gap-2 items-center text-xs mt-1'>
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <span>Jl. Dasa Darma No.20 Rawalumbu Bekasi</span>
                                </h1>
                                <div className='flex gap-4'>
                                    <h1 className='text-white font-extralight flex gap-2 items-center text-xs'>
                                        <FontAwesomeIcon icon={faClock} />
                                        <span>Weekday 11:00 - 23:00</span>
                                    </h1>

                                    <h1 className='text-white font-extralight flex gap-2 items-center text-xs'>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </h1>

                                    <h1 className='text-white font-extralight flex gap-2 items-center text-xs'>
                                        {/* <FontAwesomeIcon icon={faClock} /> */}
                                        <span>Weekend 11:00 - 00:00</span>
                                    </h1>
                                </div>
                                <button onClick={navigateToMenu} className='bg-white px-4 py-1 rounded-lg hover:bg-white/70 hover:cursor-pointer flex gap-2 items-center'>
                                    <FontAwesomeIcon icon={faMugHot} />
                                    <span>Menu</span>
                                </button>
                            </div>
                        </div>
                        <Fade cascade>
                            <div className='w-full flex justify-center items-center'>
                                <h1 className="text-xl lg:text-4xl  font-semibold border-b-2 border-gray-500">Impression</h1>
                            </div>
                            <div className='min-h-[200px] w-full flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-start lg:gap-8'>
                                <img src='/sect1.jpg' className='w-[80%] lg:w-1/5 aspect-square rounded-lg' />
                                <h1 className='w-[80%] lg:w-1/5 lg:text-2xl'>Comfy space, a great selection of grub & bev to share, and vibrant energy of a heated match.</h1>
                            </div>
                            <div className='min-h-[200px] w-full flex flex-col-reverse items-center justify-center gap-4 lg:flex-row lg:items-start lg:gap-8'>
                                <h1 className='w-[80%] lg:w-1/5 lg:text-2xl'>Every thrill and cheers made it a night to remember, and we can't wait to share it again!</h1>
                                <img src='/sect2.jpg' className='w-[80%] lg:w-1/5 aspect-square rounded-lg' />
                            </div>
                        </Fade>
                        {
                            products.length ? (
                                <Fade cascade>
                                    <div id='menu-list' className="w-full  items-center justify-center  flex flex-wrap gap-2 my-2">
                                        <div className="w-full flex justify-center ">
                                            <h1 className="text-xl lg:text-4xl  font-semibold border-b-2 border-gray-500">Favorites Menu</h1>
                                        </div>
                                        {
                                            products.map((p) => {
                                                return (
                                                    <div className=" w-[45%] lg:w-1/5  p-2 flex flex-col gap-2 shadow-md" key={p.id}>
                                                        <img src={`${dashboardUrl}${p.image}`} className="w-full object-cover shrink-0 grow-0 h-fit rounded-lg aspect-square" />
                                                        <div className="w-full">
                                                            {/* <span className="shrink-0 grow-0 w-fit rounded-xl text-white py-0.5 px-2 text-[8px] bg-black/70 flex justify-center items-center gap-1">{p.category}</span> */}
                                                            <div className="w-full flex flex-col gap-1">
                                                                <Tag className="menu-tag" color="#2b2b2b">{p.category}</Tag>
                                                                {
                                                                    p.subcategory && (
                                                                        <Tag className="menu-tag" color="#807d7d">{p.subcategory.name}</Tag>
                                                                    )
                                                                }
                                                            </div>
                                                            <h1 className="text-xs font-bold mt-1">{p.name}</h1>
                                                            <p className="text-[8px] text-gray-300 line-clamp-1">{p.description}</p>
                                                            {
                                                                (p.favoriteCount) ? (
                                                                    <div className="flex gap-2 items-center my-1">
                                                                        <HeartFilled style={{ color: 'red', fontSize: '12px' }} />
                                                                        <p className="text-xs text-gray-300">{p.favoriteCount} Likes </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex gap-2 items-center my-1">
                                                                        <HeartFilled style={{ color: 'transparent', fontSize: '12px' }} />
                                                                        <p className="text-xs text-transparent">0 Likes </p>
                                                                    </div>
                                                                )
                                                            }
                                                            <div className="w-full flex flex-col ">
                                                                <p className="text-xs mb-2">{formatRupiah(+p.price)}</p>
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
                                                                    <Link className='w-full' href={`/main/product/${p.id}`} >
                                                                        <Button className="w-full" size="small" type="primary" variant="solid" color="default" >
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
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Fade>
                            ) : (
                                <Empty />
                            )
                        }
                        <Fade cascade>
                            <div className="w-full flex flex-col gap-2 bg-testimoni min-h-[400px]  ">
                                <div className='w-full min-h-[400px]  bg-black/60 flex flex-col lg:flex-row justify-center items-center gap-2 py-4 lg:py-0'>
                                    {
                                        arrTestimoni.map((d) => (
                                            <div className='w-[80%] text-center lg:w-1/4 lg:min-h-40 bg-white rounded-lg p-4 flex flex-col justify-between'>
                                                <div>
                                                    <FontAwesomeIcon icon={faQuoteLeft} />
                                                    <h1 className='text-sm'>{d.description}</h1>
                                                </div>
                                                <div className='w-full flex justify-between items-center mt-3'>
                                                    <h1 className='font-bold'>{d.name}</h1>
                                                    <div className='flex gap-2 text-yellow-500'>
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </Fade>

                    </div>
                )
            }
        </div>
    )
}