"use client"
import { formatRupiah } from "@/lib/formatter";
import { Button, Modal, notification, Rate, Tag } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function ReviewOrderModel({ showModal, closeReviewModal, setShowModal, data }) {
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL
    const [isLoading, setIsLoading] = useState(false)
    const [rate, setRate] = useState(0)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (data && data.reviews.length > 0) {
            setRate(data.reviews[0].rate)
        }
    }, [])
    const submitReview = async () => {
        if (rate > 0) {
            try {
                setIsLoading(true)
                const payload = { rate, message }
                await axios.post(`/api/order/review/${data.id}`, payload)
                notification.open({
                    message: 'send review success',
                    type: 'success'
                })
                closeReviewModal()
            } catch (error) {
                console.log(error);
                notification.open({
                    message: 'send review error',
                    type: 'error'
                })
            } finally {
                setIsLoading(false)
            }
        } else {
            notification.open({
                message: 'Minimal rate is 1',
                type: 'warning'
            })
        }
    }

    return (
        <Modal
            title="Review"
            open={showModal}
            onCancel={() => setShowModal(false)}
            onOk={() => setShowModal(false)}
            footer={null}>
            {
                data && (
                    <div>
                        <div className="flex justify-between w-full">
                            <h1 className="font-bold">Order ID</h1>
                            <h1 className="font-bold">{data.order_id ?? data.order}</h1>
                        </div>
                        <div className="flex justify-between w-full">
                            <h1 className="font-bold">Order Date</h1>
                            <h1 className="font-bold">{dayjs(data.createdAt).format('DD MMM YYYY HH:mm')}</h1>
                        </div>
                        <div className="flex justify-between w-full">
                            <h1 className="font-bold">Table</h1>
                            <h1 className="font-bold">{data.table_number}</h1>
                        </div>
                        {
                            !data.paid_at_cashier && (
                                <div className="flex flex-col justify-between w-full">
                                    <h1 className="font-bold">Transfer Proof</h1>
                                    <img className="w-1/4 aspect-square object-contain" src={data.transfer_proof} alt="" />
                                </div>
                            )
                        }
                        <div className="flex justify-between  border-b-2 pb-2 my-2 border-gray-100">
                            <h1 className="font-bold">Status Pemesanan</h1>
                            <Tag color={
                                data.order_status == 'pending' ? 'yellow' :
                                    data.order_status == 'preparing' ? 'blue' :
                                        data.order_status == 'ready' ? 'cyan' :
                                            data.order_status == 'completed' ? 'green' :
                                                'red'
                            }>
                                {data.order_status}
                            </Tag>
                        </div>
                    </div>
                )
            }
            {
                (data && data.order_items) && (
                    data.order_items.map((p) => {
                        return (
                            <div className="border-b border-gray-200 p-2 flex gap-2" key={p.id}>
                                <img src={`${dashboardUrl}${p.product.image}`} className="max-w-18 min-w-18 object-cover shrink-0 grow-0 h-fit rounded-lg aspect-square" />
                                <div className="w-full">
                                    <h1 className="text-xs font-bold mt-1">{p.product.name}</h1>
                                    <p className=" text-gray-400 text-[8px]">Note: </p>
                                    <p className="text-[8px] text-gray-400 mb-1">{p.note}</p>
                                    <div className="w-full flex justify-between items-end">
                                        <div>
                                            <p className=" font-bold text-[8px]">Total Price: </p>
                                            <p className="text-xs font-bold">{formatRupiah(+p.total_price)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{p.quantity} x {formatRupiah(p.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                )
            }
            {
                data && (
                    <div className="w-full min-h-14 border border-gray-300 mt-4   z-[999]  rounded-xl py-1 px-4 text-black">
                        <div className="w-full flex justify-between mb-2 items-center">
                            <h1 className="text-xs font-bold">Total Price</h1>
                            <h2 className="text-sm font-bold">{formatRupiah(data.total_price)}</h2>
                        </div>
                        <div className="flex justify-between w-full">
                            <h1 className="font-bold">Pembayaran</h1>
                            <h1 className="font-bold">{data.paid_at_cashier ? 'Bayar di Kasir' : 'Transfer'}</h1>
                        </div>
                    </div>
                )
            }
            {
                data && (
                    <div className="w-full flex justify-center items-center flex-col  mt-4 mb-12 gap-y-2">
                        <h1>Rate & Review Order</h1>
                        <Rate
                            defaultValue={data.reviews.length > 0 ? data.reviews[0].rate : 0}
                            onChange={(r) => setRate(r)}
                            disabled={data.reviews.length > 0 ? true : false}
                        />
                        <textarea
                            defaultValue={data.reviews.length > 0 ? data.reviews[0].message : ''}
                            disabled={data.reviews.length > 0 ? true : false}
                            onChange={(e) => setMessage(e.target.value)} className="border border-black rounded-lg w-full" rows={5}>
                        </textarea>
                        {
                            data.reviews.length == 0 && (
                                <Button loading={isLoading} variant="solid" color="gold" onClick={submitReview} className="w-full">Submit</Button>
                            )
                        }
                    </div>
                )
            }
        </Modal>
    )
}