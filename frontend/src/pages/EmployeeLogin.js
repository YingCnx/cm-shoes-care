import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmployee } from '../services/authService'; // ✅ ใช้จาก authService
import { checkSession } from '../services/authService'; // ✅ ตรวจ session ผ่าน cookie
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Mail } from 'lucide-react';
import './Login.css';

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ ตรวจว่าเคย login แล้วหรือไม่
  useEffect(() => {
    const verifySession = async () => {
      const user = await checkSession();
      if (user) {
        //console.log("✅ Already logged in:", user);
        navigate("/dashboard");
      }
    };
    verifySession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginEmployee(email, password); // ✅ ไม่ต้องอ่าน token
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
