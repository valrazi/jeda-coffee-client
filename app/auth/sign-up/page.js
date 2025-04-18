"use client"
import { useRouter } from "next/navigation"
import { Form, Input, Button, message, Select } from "antd";
import { signIn } from "next-auth/react";
import '@ant-design/v5-patch-for-react-19';
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { CoffeeOutlined } from "@ant-design/icons";

export default function SignIn() {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const onFinish = async (values) => {
        const { email, password, full_name, phone_number, security_question, security_answer, kota_asal } = values;
        try {
            setLoading(true)
            await axios.post('/api/auth/sign-up', {
                email,
                password,
                phone_number,
                full_name,
                security_question, security_answer,
                kota_asal
            })
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Register successful!");
                router.push("/main");
            }
        } catch (error) {
            console.log(error);
            if (error.isAxiosError) {
                message.error(error.response.data.error)
                return
            }
            message.error('Register Failed')
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-between gap-4">
            <div className="w-full items-center bg-black flex text-white gap-2 py-3 px-4">
                <CoffeeOutlined className="text-sm font-semibold -translate-y-[0.1rem] lg:text-xl lg:-translate-y-[0.15rem]" />
                <span className="text-sm font-semibold font-poppins lg:text-xl">Jeda Kopi</span>
            </div>
            <div className="w-full px-4">
            <div className="w-full max-w-[512px] bg-white/25 m-auto border-2 border-black  py-6 px-4 rounded-xl shadow-md     flex flex-col items-center">
                <img src="/logo.png" className="w-28" />
                <h1 className="text-black font-bold text-[1.2rem] my-2 text-left font-poppins">Sign Up New Account</h1>
                <Form
                    layout="vertical"
                    className="w-full"
                    onFinish={onFinish}>
                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Phone Number</label>}
                        name="phone_number"
                        rules={[
                            { required: true, message: "Phone Number is required" },
                        ]}
                    >
                        <Input size="large" placeholder="example: 81248161227" />
                    </Form.Item>

                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Full Name</label>}
                        name="full_name"
                        rules={[
                            { required: true, message: "Full Name is required" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter your full name" />
                    </Form.Item>

                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Kota Asal</label>}
                        name="kota_asal"
                        rules={[
                            { required: true, message: "Kota Asal is required" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter your kota asal" />
                    </Form.Item>


                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Email</label>}
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Invalid email format" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Password</label>}
                        name="password"
                        rules={[{ required: true, message: "Password is required" }]}
                    >
                        <Input.Password size="large" placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Security Question</label>}
                        name="security_question"
                        rules={[
                            { required: true, message: "Security Question is required" },
                        ]}
                    >
                        <Select>
                            <Select.Option value="pet">1. Your First Pet Name?</Select.Option>
                            <Select.Option value="teacher">2. Your First Teacher Name?</Select.Option>
                            <Select.Option value="school">3. Your First School Name?</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Security Answer</label>}
                        name="security_answer"
                        rules={[
                            { required: true, message: "Security Answer is required" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter your answer" />
                    </Form.Item>

                    <div className="w-full font-poppins flex justify-center items-center gap-2 mb-4">
                        <span>Already have account?</span>
                        <Link href='/auth/sign-in?callbackUrl=%2Fmain' >
                            <p className="text-black font-bold ">Sign In?</p>
                        </Link>
                    </div>
                    <Form.Item>
                        <Button loading={loading} type="primary" variant="solid" color="default" htmlType="submit" className="w-full">
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            </div>

            <div className="w-full items-center justify-center bg-black flex gap-2 text-white py-2 px-4">
                <span className="text-[8px] font-thin">©  Jeda Kopi. All rights reserved.</span>
            </div>
        </div>
    )
}