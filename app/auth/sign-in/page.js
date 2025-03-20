"use client"
import { useRouter } from "next/navigation"
import { Form, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import '@ant-design/v5-patch-for-react-19';

export default function SignIn() {
    const router = useRouter()
    

    const onFinish = async (values) => {
        const { email, password } = values;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result.error) {
            message.error(result.error);
        } else {
            message.success("Login successful!");
            router.push("/main/form"); // Redirect after login
        }
    };
    return (
        <div className="min-h-screen min-w-screen  bg-white flex flex-col items-center p-4">
            <img src="https://www.unifiber.id/assets/logos/logo-color.svg" className="w-44" />
            <h1 className="text-orange-500 font-bold text-[2rem] my-2">LIVE REPORT</h1>

            <Form 
            layout="vertical" 
            className="w-full lg:w-1/3"
            onFinish={onFinish}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
                        { type: "email", message: "Invalid email format" },
                    ]}
                >
                    <Input size="large" placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Password is required" }]}
                >
                    <Input.Password size="large" placeholder="Enter your password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" variant="solid" color="orange" htmlType="submit" className="w-full">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}