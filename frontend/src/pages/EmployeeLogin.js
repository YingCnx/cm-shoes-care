import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmployee, checkSession } from '../services/authService';
import { getAllBranchesPublic } from '../services/api';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Mail } from 'lucide-react';
import './Login.css';
import socket from '../services/socket.js';

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const navigate = useNavigate();

  // ✅ ตรวจ session
  useEffect(() => {
    const verifySession = async () => {
      const user = await checkSession();
      if (user?.branch_id) {
          sessionStorage.setItem("branch_id", user.branch_id);

          connectSocket(); // ✅ เรียกให้ connect ก่อน

          socket.emit("join-branch", { branch_id: user.branch_id });
          window.dispatchEvent(new Event("branch_id_set"));
        }
              
      if (user) {
        navigate("/dashboard");
      }
    };
    verifySession();
  }, [navigate]);

  // ✅ โหลดรายชื่อสาขา
  useEffect(() => {
    const fetchBranches = async () => {
      const res = await getAllBranchesPublic();
      setBranches(res.data);
    };
    fetchBranches();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    //console.log("📥 Employee Login Attempt:", email, "Branch:", selectedBranch);
    if (!selectedBranch) {
      alert("⚠️ กรุณาเลือกสาขาก่อนล็อกอิน");
      return;
    }
    
    try {
      await loginEmployee(email, password, selectedBranch); // ✅ ส่ง branch_id ไปด้วย
       // 🟡 ตรวจ session อีกรอบเพื่อให้แน่ใจว่ามีข้อมูล session (เช่น branch_id)
    const user = await checkSession();

    if (user?.branch_id) {
      sessionStorage.setItem("branch_id", user.branch_id);
      socket.emit('join-branch', { branch_id: user.branch_id }); // ✅ บอก socket ให้เข้าห้องทันที
    }
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "🚨 ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
      alert("❌ ล็อกอินล้มเหลว: " + msg);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardHeader className="login-card-header">
          <CardTitle className="login-title">🔑 Employee Login</CardTitle>
        </CardHeader>
        <CardContent className="login-card-content">
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                className="input-field"
              >
                <option value="">-- เลือกสาขา --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-container">
              <Button type="submit" className="login-button">Login</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeLogin;
