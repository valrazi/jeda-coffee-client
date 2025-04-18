import { useCartContext } from "@/context/CartContext";
import { formatRupiah } from "@/lib/formatter";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Image, message, Modal, Select, Upload } from "antd";
import axios from "axios";
import { useState } from "react";
import { tableList } from '@/data/table'
export default function CheckoutModal({ showModal, setShowModal, finishCheckout, isPaidCashier }) {
    const [cart, setCart] = useCartContext()
    const [tableNumber, setTableNumber] = useState()
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false)

    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL
    const [fileList, setFileList] = useState([])
    const [transferProof, setTransferProof] = useState()
    const getBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const closeModal = () => {
        setShowModal(false)
        setFileList([])
        setTableNumber(undefined)
        setTransferProof(undefined)
    }

    const tableNumberChange = (value) => {
        setTableNumber(value)
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    }

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const customRequest = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('image', file); // Ensure the field name matches Laravel validation
        try {
            const response = await axios.post('http://localhost:8000/api/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onSuccess(response.data);
            setTransferProof(response.data.url)
        } catch (error) {
            onError(error);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const checkout = async () => {
        try {
            setLoading(true)
            if (!isPaidCashier && (!tableNumber || !transferProof)) {
                message.warning('Please select table number and input transfer proof!')
                return
            }
            await axios.post('/api/cart/checkout/' + cart.id, {
                table_number: tableNumber,
                transfer_proof: transferProof,
                paid_at_cashier: isPaidCashier ? 1 : 0
            })
            message.success('Checkout succesfully')
            finishCheckout()
        } catch (error) {
            console.log(error);
            message.error(error.response.data.error)
        } finally {
            setLoading(false)
        }
    }
    return (
        showModal && (
            <Modal
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '50%',
                    xl: '35%',
                    xxl: '40%',
                }}
                footer={null}
                title="Checkout" open={showModal} onOk={closeModal} onCancel={closeModal}>
                {
                    !isPaidCashier && (
                        <div className="w-full border-y-2 border-gray-200 my-2 py-2">
                            <div className="w-full flex flex-col justify-center items-center">
                                <img src="/bca.png" className="w-1/2" alt="" />
                                <h1 className="text-lg font-bold mt-2">88728939028 a/n Jeda Kopi</h1>
                                <h1 className="text-lg font-bold">Total: {formatRupiah(+cart.total_price)}</h1>
                            </div>
                        </div>
                    )
                }
                <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="">Table Number</label>
                    <Select
                        onChange={tableNumberChange}
                        options={
                            tableList.map((t) => {
                                return {
                                    value: t,
                                    label: `Table ${t}`
                                }
                            })
                        } />
                </div>

                {
                    !isPaidCashier && (
                        <div className="flex flex-col gap-1">
                            <label htmlFor="">Transfer Proof</label>
                            <Upload
                                customRequest={customRequest}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                method="post"
                            >
                                {fileList.length >= 1 ? null : uploadButton}

                            </Upload>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </div>
                    )
                }

                <div className="w-full my-2">
                    <Button loading={loading} onClick={checkout} variant="solid" color="default" style={{ width: '100%' }}>Checkout</Button>
                </div>
            </Modal>
        )
    )
}