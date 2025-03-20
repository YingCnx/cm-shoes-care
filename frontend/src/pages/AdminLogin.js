import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from "../services/api";
import Input from '../components/ui/input';   // เปลี่ยนเป็น default import
import Button from '../components/ui/button'; // เปลี่ยนเป็น default import
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Mail } from 'lucide-react';
import '../styles/Login.css';


const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // หรือ sessionStorage.getItem("token")
    if (token) {
      navigate("/dashboard"); // ถ้ามี Token ให้ไปที่หน้า Dashboard ทันที
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await loginAdmin(email, password);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/admin/dashboard");
    } catch (error) {
        alert("❌ ล็อกอินล้มเหลว: " + error.response.data.message);
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
              {error && <p className="error-message">{error}</p>}
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
