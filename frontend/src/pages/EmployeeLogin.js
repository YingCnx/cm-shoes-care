import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmployee } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import Input from '../components/ui/input';   
import Button from '../components/ui/button'; 
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Mail } from 'lucide-react';
import '../styles/Login.css';

const EmployeeLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // ✅ เพิ่ม state สำหรับ error
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          try {
              const user = jwtDecode(token);
              console.log("✅ User Logged in:", user);
              navigate("/dashboard"); // ✅ Redirect ไป Dashboard
          } catch (error) {
              console.error("🔴 Error decoding token:", error);
              localStorage.removeItem("token"); // ✅ ล้าง Token ถ้าใช้ไม่ได้
          }
      }
  }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginEmployee(email, password);
            
            // ✅ ตรวจสอบว่ามี Token ส่งกลับมาหรือไม่
            if (!response.data.token) {
                throw new Error("ไม่พบ Token จากเซิร์ฟเวอร์");
            }
    
            // ✅ เก็บ Token และ Role
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
    
            navigate("/dashboard"); // ✅ ไปที่ Dashboard หลัง Login
        } catch (err) {
            setError(err?.response?.data?.message || "เกิดข้อผิดพลาดในการล็อกอิน");
        }
    };
    

  return (
    <div className="login-container">
      <div className="login-card">
        <Card className="login-card-content">
          <CardHeader>
            <CardTitle className="login-title">🔑 Employee Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="error-message">{error}</p>} {/* ✅ แสดงข้อความ Error */}
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
              <div className="button-container">
                <Button type="submit" className="login-button">Login</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLogin;
