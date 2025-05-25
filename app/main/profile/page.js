"use client"
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, Avatar, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProfilePage = () => {
  const { data: session, update } = useSession(); // Fetch NextAuth session
  
  const [user, setUser] = useState()
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  if (!session) return <p>Loading...</p>;
  
  
  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user/detail')
      setUser({
        name: res.data.user.full_name,
        email: res.data.user.email,
        kota_asal: res.data.user.kota_asal
      })
      console.log(session);
    } catch (error) {
      console.log(error);
      message.error('Fetch user detail failed')
    }
  }
  // Handle full name update
  const handleUpdateName = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Call your API to update the user's full name
      const res = await axios('/api/user/information', {
        method: 'PUT',
        data: { full_name: values.full_name, email: values.email, kota_asal: values.kota_asal },
      });

      message.success("Full name updated successfully!");
      setIsEditNameModalOpen(false);
      console.log({ values: res.data.updatedUser });
      fetchUser()
    } catch (err) {
      console.log(err);
      message.error("Error updating name");
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);

      // Call your API to update password
      const res = await fetch('/api/user/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: values.current_password, new_password: values.password }),
      });

      if (!res.ok) throw new Error('Failed to update password');

      message.success("Password updated successfully!");
      setIsEditPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (err) {
      message.error("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center py-4">
      <Card style={{ width: 400, height: '250px', textAlign: 'center', margin: '' }}>
        <Avatar size={80} src={user?.image} icon={<UserOutlined />} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>

        <div className='w-full flex flex-col gap-2 my-4'>
          <Button variant='solid' color='default' icon={<EditOutlined />} onClick={() => setIsEditNameModalOpen(true)} >
            Edit Full Name
          </Button>

          <Button variant='solid' color='gold' icon={<LockOutlined />} onClick={() => setIsEditPasswordModalOpen(true)} type="primary">
            Change Password
          </Button>
        </div>
      </Card>

      {/* Modal for Editing Full Name */}
      <Modal
        title="Edit Full Name"
        open={isEditNameModalOpen}
        onOk={handleUpdateName}
        confirmLoading={loading}
        onCancel={() => setIsEditNameModalOpen(false)}
      >
        <Form form={form} layout="vertical" initialValues={{ full_name: user?.name, email: user?.email, kota_asal: user?.kota_asal }}>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Kota Asal"
            name="kota_asal"
            rules={[{ required: true, message: 'Please enter your kota asal' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Changing Password */}
      <Modal
        title="Change Password"
        open={isEditPasswordModalOpen}
        onOk={handleUpdatePassword}
        confirmLoading={loading}
        onCancel={() => setIsEditPasswordModalOpen(false)}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="Current Password"
            name="current_password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

export default ProfilePage;
