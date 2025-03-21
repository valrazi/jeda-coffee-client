"use client"
import { useSession, getSession } from "next-auth/react"
import { Form, Input, Button, Select, message, Modal, Upload, notification } from "antd";
import axios from "axios";
import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from "next/dynamic";
import { CameraOutlined, UploadOutlined, CheckCircleOutlined, XOutlined, ReloadOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
const MapComponent = dynamic(() => import("./components/Map"), { ssr: false });
const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";
const videoConstraints = {
    facingMode: FACING_MODE_USER
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import Swal from "sweetalert2";
import Router from "next/router";
const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link']
    ]
};
export default function FormPage() {
    const router = useRouter();
    const [subjectList, setSubjectList] = useState([])
    const [regionList, setRegionList] = useState([])
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [showAllowButton, setShowAllowButton] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ticketId, setTicketId] = useState("")
    const [description, setDescription] = useState("");
    const [cameraErrorModal, setCameraErrorModal] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [listCapturedImage, setListCapturedImage] = useState([])
    const [fileList, setFileList] = useState([]);
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

    const webcamRef = useRef(null);
    const webcamSwitch = useCallback(() => {
        setFacingMode(prevMode =>
            prevMode === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER
        );
    }, []);


    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setIsCameraActive(false); // Hide camera after capturing
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUploadChange = async ({ fileList }) => {
        const base64Images = await Promise.all(
            fileList.map(file => getBase64(file.originFileObj))
        );

        console.log("Base64 Images:", base64Images);
        setFileList(fileList);
    };

    const fetchSubjectList = async () => {
        try {
            let data = await axios.get('/api/subject')
            data = data.data.data.map((d) => {
                return {
                    value: d.title,
                    label: d.title
                }
            })
            setSubjectList(data)
        } catch (error) {
            console.log(error);
            message.error(error.error)
        }
    }

    const fetchRegionList = async () => {
        try {
            let data = await axios.get('/api/region')
            data = data.data.data.map((d) => {
                return {
                    value: d.city,
                    label: d.city
                }
            })
            setRegionList(data)
        } catch (error) {
            console.log(error);
            if (error.isAxiosError) {
                message.error(error.response.data.error)
            }
        }
    }

    const fetchTicketId = async () => {
        try {
            let data = await axios.get('/api/ticket-id')
            setTicketId(data.data.data.id)
        } catch (error) {
            console.log(error);
            if (error.isAxiosError) {
                message.error(error.response.data.error)
            }
        }
    }

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            message.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6),
                });
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setShowAllowButton(true);
                }
            }
        );
    };

    const handleShowModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };


    useEffect(() => {
        fetchSubjectList()
        fetchRegionList()
        getUserLocation()
        fetchTicketId()
        navigator.permissions
            .query({ name: "geolocation" })
            .then((result) => {
                if (result.state === "granted") {
                    getUserLocation();
                } else if (result.state === "prompt") {
                    setShowAllowButton(true);
                }
                result.onchange = () => {
                    if (result.state === "granted") {
                        getUserLocation();
                    }
                };
            });
    }, [])

    const onFinish = async (values) => {
        if (!location.lat || !location.lng) {
            message.error('Access Location Permission Must Be Permitted!')
            return
        }
        if (!values.description || values.description == '<p><br></p>') {
            message.error('Please input the description')
            return
        }
        if (!listCapturedImage.length) {
            message.error("Please attach atleast 1 captured image")
            return
        }
        if (capturedImage) {
            message.error("Image not yet confirmed / undo!")
            return
        }
        let newDescription = `${values.region}\n<br>\n<br>Position ${location.lat},${location.lng}\n<br>${values.description}`
        if (fileList.length) {
            const base64Images = await Promise.all(
                fileList.map(file => getBase64(file.originFileObj))
            );
            base64Images.forEach((f) => {
                console.log(f);
                newDescription += `\n<br><img src='${f}'/>`
            })
        }
        if (listCapturedImage.length) {
            listCapturedImage.forEach((f) => {
                newDescription += `\n<br><img src='${f}'/>`
            })
        }
        const payload = {
            subject: `Internal Service Request_${values.subject}`,
            description: newDescription
        }

        try {
            const data = await axios.post('/api/ticket', payload)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Ticket with ID ${data.data.data.newTicket.ticket_id} has been created`
            })
                .then(() => {
                    window.location.reload()
                })
        } catch (error) {
            console.log(error.response.data.error);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.response.data.error
            })
        }
    };
    return (
        <div>
            <Modal title="How to Enable Location" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalOk}>
                <p>1. Go to your browser settings.</p>
                <p>2. Find "Location" permissions.</p>
                <p>3. Allow location access for this website.</p>
                <p>4. Refresh the page.</p>
            </Modal>
            <Modal title="How to Enable Camera" open={cameraErrorModal} onOk={() => setCameraErrorModal(false)} onCancel={() => setCameraErrorModal(false)}>
                <p>1. Go to your browser settings.</p>
                <p>2. Find "Camera" permissions.</p>
                <p>3. Allow camera access for this website.</p>
                <p>4. Refresh the page.</p>
            </Modal>
            <Form
                layout="vertical"
                className="w-full"
                onFinish={onFinish}>
                <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[
                        { required: true, message: "Subject is required" },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select Subject"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={subjectList} />
                </Form.Item>

                <Form.Item
                    label="Region"
                    name="region"
                    rules={[
                        { required: true, message: "Region is required" },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select Region"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={regionList} />
                </Form.Item>

                <Form.Item
                    label="Latitude & Longitude">
                    <Input
                        value={location.lat && location.lng ? `${location.lat}, ${location.lng}` : ""}
                        readOnly
                        disabled
                        placeholder="Location not available"
                    />
                    {showAllowButton && (
                        <Button type="primary" onClick={handleShowModal} className="mt-2">
                            Allow Location Access
                        </Button>
                    )}

                    {(location.lat != 0 && location.lng != 0) && (
                        <div className="my-2">
                            <MapComponent lat={location.lat} lng={location.lng} changeLocation={setLocation} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    label="Assign to">
                    <Input
                        value="ONM"
                        readOnly
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    label="Ticket ID">
                    <Input
                        value={ticketId}
                        readOnly
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    label="Description" name="description" style={{
                        height: '300px'
                    }}>
                    <ReactQuill style={{
                        height: '230px'
                    }} theme="snow" value={description} onChange={setDescription} modules={modules} />
                </Form.Item>

                <Form.Item label="Capture Image">
                    {isCameraActive ? (
                        <div>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                videoConstraints={{
                                    ...videoConstraints,
                                    facingMode
                                }}
                            />
                            <Button type="primary" onClick={captureImage} className="mt-2 mr-4">
                                Take Picture
                            </Button>
                            <Button type="dashed" icon={<ReloadOutlined />} onClick={webcamSwitch}>
                                Switch Camera
                            </Button>
                        </div>
                    ) : (
                        <Button type="dashed" icon={<CameraOutlined />} onClick={() => setIsCameraActive(true)}>
                            Open Camera
                        </Button>
                    )}

                    {capturedImage && (
                        <div>
                            <p>Preview:</p>
                            <img src={capturedImage} alt="Captured" style={{ width: "100%", marginTop: "10px" }} />
                            <div className="flex gap-2 mt-2">
                                <Button onClick={() => {
                                    setListCapturedImage([...listCapturedImage, capturedImage])
                                    setCapturedImage(undefined)
                                }} icon={<CheckCircleOutlined />} type="primary" variant="solid" color="green">
                                    Confirm
                                </Button>
                                <Button onClick={() => setCapturedImage(undefined)} icon={<XOutlined />} type="primary" variant="solid" color="red">
                                    Undo
                                </Button>
                            </div>
                        </div>
                    )}

                    {listCapturedImage.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {listCapturedImage.map((img, index) => (
                                <img key={index} src={img} alt="Selected" className="w-20 h-20 object-cover mr-2" />
                            ))}
                        </div>
                    )}


                </Form.Item>

                {/* <Form.Item label="Upload Image">
                    <Upload onChange={handleUploadChange} beforeUpload={() => false} listType="picture-card">
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item> */}

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}