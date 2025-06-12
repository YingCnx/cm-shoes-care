import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EmployeeLogin from './pages/EmployeeLogin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/Dashboard';
import Dashboard from './pages/Dashboard';
import AppointmentsAdmin from './pages/AppointmentsAdmin';
import QueueAdmin from './pages/QueueAdmin';
import QueueEntry from './pages/QueueEntry';
import QueueDetail from './pages/QueueDetail';
import BranchManagement from './pages/BranchManagement';
import UserManagement from './pages/UserManagement';
import ServiceManagement from './pages/ServiceManagement';
import CustomerManagement from './pages/CustomerManagement';
import Payments from './pages/Payments';
import EmployeeManagement from './pages/EmployeeManagement';
import ReportManagement from './pages/ReportManagement';
import Payouts from './pages/Payouts';
import './assets/css/bootstrap.min.css';
import './App.css';
import ProtectedRoute from "./routes/ProtectedRoute";
import { useEffect, useState } from 'react'; // ⬅️ เพิ่มตัวนี้ที่ด้านบน
import ReturnToLocker from './pages/ReturnToLocker';
import LockerManagement from './pages/LockerManagement';
import PendingPickupFromLocker from './pages/lockersPages/PendingPickupFromLocker';






function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}


function MainLayout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/admin/login";
  const [currentTime, setCurrentTime] = useState(new Date());

   useEffect(() => {
    if (hideSidebar) {
      document.body.classList.add('no-sidebar');
    } else {
      document.body.classList.remove('no-sidebar');
    }
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <div className={`main-content ${hideSidebar ? "no-sidebar" : ""}`}>
         {/* ✅ เพิ่ม Topbar เฉพาะหน้าที่ไม่ใช่ login */}
        {!hideSidebar && (
          <div className="topbar">
            <div className="fw-bold">CM SHOES CARE ระบบจัดการร้านซักเกิบแอนด์สปา</div>
            <div><p className="text-gray-600 text-sm mt-1">
                {currentTime.toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} - {currentTime.toLocaleTimeString('th-TH')}
              </p></div>
          </div>
        )}

        <Routes>
          {/* 🔐 Login */}
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
       
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <QueueAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue-entry"
            element={
              <ProtectedRoute>
                <QueueEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue/:id"
            element={
              <ProtectedRoute>
                <QueueDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue/:queue_id/detail"
            element={
              <ProtectedRoute>
                <QueueDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/branch"
            element={
              <ProtectedRoute>
                <BranchManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServiceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payouts"
            element={
              <ProtectedRoute>
                <Payouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/returntolocker"
            element={
              <ProtectedRoute>
                <ReturnToLocker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Lockers"
            element={
              <ProtectedRoute>
                <LockerManagement />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/lockers/pending-pickup"
            element={
            <ProtectedRoute>
              <PendingPickupFromLocker />
            </ProtectedRoute>
            } 
          />


          

          {/* 🔁 fallback */}
          <Route path="*" element={<EmployeeLogin />} />
        </Routes>
                {/* ✅ เพิ่ม Footer ที่ทุกหน้ามองเห็น */}
        {!hideSidebar && (
          <footer>© 2025 CM Shoes Care | ระบบจัดการร้านซักเกิบแอนด์สปา v1.0</footer>
        )}
      </div>
    </>
  );
}

export default App;
