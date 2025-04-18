"use client"
import DownloadReceiptButton from "@/components/Order/button.receipt";
import DetailOrderModel from "@/components/Order/detail.modal";
import { formatRupiah } from "@/lib/formatter";
import { Badge, Button, message, Tag } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function OrderPage() {
    const [orders, setOrders] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [detailOrder, setDetailOrder] = useState()
    const [loading, setLoading] = useState(false)
    const fetchOrder = async () => {
        try {
            const data = await axios.get('/api/order')
            setOrders(data.data.order)
        } catch (error) {
            console.log(error);
            message.error(error.respose.error)
        }
    }
    const setModalDetail = (order) => {
        setDetailOrder(order)
        setShowModal(true)
    }
    const cancelOrder = (order) => {
        Swal.fire({
            showCancelButton: true,
            icon: 'question',
            title: 'Cancel?',
            text: "Action cannot be undone"
        })
            .then(async (res) => {
                if (res.isConfirmed) {
                    setLoading(true)
                    try {
                        await axios.post('/api/order/cancel/' + order.id)
                        message.success('Canceled order success')
                        fetchOrder()
                    } catch (error) {
                        console.log(error);
                        message.error(error.response.data.error)
                    } finally {
                        setLoading(false)
                    }
                }
            })
    }

    const completeOrder = (order) => {
        Swal.fire({
            showCancelButton: true,
            icon: 'question',
            title: 'Completed?',
            text: "Action cannot be undone"
        })
            .then(async (res) => {
                if (res.isConfirmed) {
                    setLoading(true)
                    try {
                        await axios.post('/api/order/complete/' + order.id)
                        message.success('Complete order success')
                        fetchOrder()
                    } catch (error) {
                        console.log(error);
                        message.error(error.response.data.error)
                    } finally {
                        setLoading(false)
                    }
                }
            })
    }
    useEffect(() => {
        fetchOrder()
    }, [])
    return (
        <div className="p-4 w-full flex flex-wrap gap-2">
            <DetailOrderModel
                showModal={showModal}
                setShowModal={setShowModal}
                data={detailOrder}
            />
            {
                (orders) && (
                    orders.map((o) => {
                        return (
                            <div key={o.id} className="w-full md:w-1/4 border-2 rounded-lg border-gray-100 p-4">
                                <div className="w-full flex flex-col justify-between items-start gap-1 mb-2">
                                    <Tag color={
                                        o.order_status == 'pending' ? 'yellow' :
                                            o.order_status == 'preparing' ? 'blue' :
                                                o.order_status == 'ready' ? 'cyan' :
                                                    o.order_status == 'completed' ? 'green' :
                                                        'red'
                                    }>
                                        {o.order_status}
                                    </Tag>

                                    <div className="flex gap-2 items-start text-xs font-bold">
                                        <h1>{dayjs(o.createdAt).format('DD/MM/YYYY HH:mm')}</h1>
                                        <span>-</span>
                                        <h1>{formatRupiah(o.total_price)}</h1>
                                    </div>
                                    <h1>Table: {o.table_number}</h1>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        size="small"
                                        variant="solid"
                                        color="default"
                                        onClick={() => setModalDetail(o)}
                                        style={{ width: '100%' }}>Detail</Button>
                                    {
                                        o.order_status == 'pending' && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="red"
                                                onClick={() => cancelOrder(o)}
                                                style={{ width: '100%' }}>Cancel</Button>
                                        )
                                    }

                                    {
                                        o.order_status == 'ready' && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="green"
                                                onClick={() => completeOrder(o)}
                                                style={{ width: '100%' }}>Complete</Button>
                                        )
                                    }
                                    {o.order_status === 'completed' && (
                                        <DownloadReceiptButton  orderId={o.id} />
                                    )}
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}