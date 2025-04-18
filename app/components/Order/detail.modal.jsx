import { formatRupiah } from "@/lib/formatter";
import { Modal, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
export default function DetailOrderModel({ showModal, setShowModal, data }) {
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL
    return (
        <Modal
            title="Detail"
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
                    <div className="w-full min-h-14 border border-gray-300 mt-4 mb-12  z-[999]  rounded-xl py-1 px-4 text-black">
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
        </Modal>
    )
}