import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, createAdmin, deleteUser } from '../services/api';
import './UserManagement.css';
import '../assets/css/bootstrap.min.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect if no token
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("🔴 Error fetching users:", error);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        setMessage("❌ กรุณากรอกข้อมูล Email และ Password");
        return;
      }

      if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการสร้างผู้ใช้นี้?")){
        return;
      }
      await createAdmin(email, password);
      setMessage("✅ Admin created successfully!");
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Failed to create admin');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("🔴 Error deleting user:", error);
      }
    }
  };

  return (
    <div className="user-management-container">
      <h2>👤 SuperAdmin Management</h2>
      <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ กลับไปหน้า Dashboard</button>
      
      <div className="card p-3 my-3 shadow">
        <h5>➕ เพิ่มแอดมินใหม่</h5>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="form-control mb-2" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="form-control mb-2" 
        />
        <button className="btn btn-primary" onClick={handleCreateAdmin}>Create Admin</button>
        {message && <p className="text-info mt-2">{message}</p>}
      </div>
      
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.email}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>❌ ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
