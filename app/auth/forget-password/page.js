"use client"
import { useRouter } from "next/navigation"
import { Form, Input, Button, message, Select } from "antd";
import { signIn } from "next-auth/react";
import '@ant-design/v5-patch-for-react-19';
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { CoffeeOutlined } from "@ant-design/icons";
const { Option } = Select
export default function SignIn() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onFinish = async (values) => {
        const { email, password, security_question, security_answer } = values;
        try {
            setLoading(true)
            await axios.post('/api/auth/reset-password', {
                email,
                password,
                security_question,
                security_answer
            })
            message.success('Reset password succesfully')
            router.push('/auth/sign-in')
        } catch (error) {
            console.log(error);
            message.error(error.response.data.error)
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className="min-h-screen w-full bg-white font-poppins flex flex-col items-center justify-between gap-8">
            <div className="w-full items-center bg-black flex text-white gap-2 py-3 px-4">
                <CoffeeOutlined className="text-sm font-semibold -translate-y-[0.1rem] lg:text-xl lg:-translate-y-[0.15rem]" />
                <span className="text-sm font-semibold font-poppins lg:text-xl">Jeda Kopi</span>
            </div>

            <div className="w-full px-4">
                <div className="w-full max-w-[512px] border-2 border-black bg-white/25 m-auto p-4 rounded-xl shadow-md     flex flex-col items-center">
                    <img src="/logo.png" className="w-28" />
                    <h1 className="text-black font-bold text-[1.2rem] my-2 text-left">Reset Password</h1>
                    <Form
                        layout="vertical"
                        className="w-full"
                        onFinish={onFinish}>
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

                        <Form.Item
                            label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>New Password</label>}
                            name="password"
                            rules={[{ required: true, message: "Password is required" }]}
                        >
                            <Input.Password size="large" placeholder="Enter your password" />
                        </Form.Item>
                        <div className="w-full font-poppins flex justify-center items-center gap-2 mb-4">
                            <span>Sign In Instead?</span>
                            <Link href='/auth/sign-in?callbackUrl=%2Fmain' >
                                <p className="text-black font-bold ">Sign In</p>
                            </Link>
                        </div>

                        <Form.Item>
                            <Button loading={loading} type="primary" variant="solid" color="default" htmlType="submit" className="w-full">
                                Reset Password
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