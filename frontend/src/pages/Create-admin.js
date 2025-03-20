import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdmin } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // ถ้าไม่มี Token ให้ Redirect ไปหน้า Login
    }
  }, [navigate]);

  const handleCreateAdmin = async () => {
    console.log("🔹 Sending Data:", email, password); // ✅ ตรวจสอบค่าที่ส่งไป
    try {
      const res = await createAdmin(email, password);
      setMessage(res.data.message);
    } catch (error) {
        console.error("🔴 Create Admin Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบ Token ออกจาก Local Storage
    window.location.href = '/login'; // Redirect ไปหน้า Login
  };

  


  return (
    <div>
      <h1>📊 Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Create New Admin</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleCreateAdmin}>Create Admin</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
