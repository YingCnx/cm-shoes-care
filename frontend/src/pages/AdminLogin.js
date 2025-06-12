import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, checkSession } from "../services/authService";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Lock, Mail } from "lucide-react";
import "../styles/Login.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ ตรวจว่า login แล้วหรือยัง
  useEffect(() => {
    const verifySession = async () => {
      const user = await checkSession();
      if (user?.role === "superadmin") {
        console.log("✅ Admin already logged in:", user);
        navigate("/admin/dashboard");
      }
    };
    verifySession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(email, password); // ✅ ไม่ต้องเก็บ token
      navigate("/admin/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "🚨 ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
      alert("❌ ล็อกอินล้มเหลว: " + msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Card className="login-card-content">
          <CardHeader>
            <CardTitle className="login-title">🔑 Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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

export default AdminLogin;
