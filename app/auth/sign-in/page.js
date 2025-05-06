"use client"
import { useRouter } from "next/navigation"
import { Form, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import '@ant-design/v5-patch-for-react-19';
import Link from "next/link";

import { CoffeeOutlined } from '@ant-design/icons'
import { useState } from "react";

export default function SignIn() {
    const router = useRouter()
    const [loading, setLoading] = useState()

    const onFinish = async (values) => {
        const { email, password } = values;
        setLoading(true)
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        setLoading(false)
        if (result.error) {
            message.error(result.error);
        } else {
            message.success("Login successful!");
            router.push("/main"); // Redirect after login
        }
    };
    return (
        <div className=" min-h-screen w-full bg-white flex flex-col justify-between items-center">
            <div className="w-full items-center bg-black flex gap-2 text-white py-3 px-4">
                <CoffeeOutlined className="text-sm font-semibold -translate-y-[0.1rem] lg:text-xl lg:-translate-y-[0.15rem]" />
                <span className="text-sm font-semibold lg:text-xl">Jeda Kopi</span>
            </div>
            <div className="w-full px-4">
                <div className="w-full font-poppins max-w-[512px] bg-white/25 m-auto p-4 rounded-xl shadow-md border-2 border-black   flex flex-col items-center">
                    <img src="/logo.png" className="w-28" />
                    <h1 className="font-poppins text-black font-bold text-[1.2rem] my-2 text-left">Sign In Existed Account</h1>
                    <Form
                        layout="vertical"
                        className="w-full font-poppins"
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
                            label={<label className="font-poppins" style={{ color: "black", fontWeight: 'bold' }}>Password</label>}
                            name="password"
                            rules={[{ required: true, message: "Password is required" }]}
                        >
                            <Input.Password size="large" placeholder="Enter your password" />
                        </Form.Item>
                        <div className="w-full flex flex-col gap-2 justify-end items-end mb-4">

                            <Link href='/auth/forget-password'>
                                <p className="text-black font-semibold">Forget Password?</p>
                            </Link>
                        </div>
                        <Form.Item>
                            <Button type="primary" variant="solid" color="default" htmlType="submit" className="w-full">
                                Sign In
                            </Button>
                        </Form.Item>
                        <div className="w-full font-poppins flex justify-center items-center gap-2">
                            <span>Don't have an account?</span>
                            <Link href='/auth/sign-up'>
                                <p className="text-black font-semibold">Sign Up</p>
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>

            <div className="w-full items-center justify-center bg-black flex gap-2 text-white py-2 px-4">
                <span className="text-[8px] font-thin">©  Jeda Kopi. All rights reserved.</span>
            </div>
        </div>
    )
}