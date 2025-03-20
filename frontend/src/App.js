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
import Payments from './pages/Payments';
import EmployeeManagement from './pages/EmployeeManagement';
import ReportManagement from './pages/ReportManagement';
import Payouts from './pages/Payouts';
import ProtectedRoute from "./components/ProtectedRoute";
import './assets/css/bootstrap.min.css';



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

  return (
      <>
          {!hideSidebar && <Sidebar />}
          <div className="main-content">
              <Routes>                 
                  {/* 🔐 Login สำหรับพนักงาน */}
                  <Route path="/login" element={<EmployeeLogin />} />                  
                  {/* 🔐 Login สำหรับ Admin */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  {/* <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/appointments" element={<AppointmentsAdmin />} />
                    <Route path="/queue" element={<QueueAdmin />} />
                    <Route path="/queue-entry" element={<QueueEntry />} />
                    <Route path="/queue/:id" element={<QueueDetail />} />
                    <Route path="/queue/:queue_id/detail" element={<QueueDetail />} />
                    <Route path="/branch" element={<BranchManagement />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/services" element={<ServiceManagement />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/employee" element={<EmployeeManagement />} />
                    
                    <Route path="*" element={<EmployeeLogin />} />
                  </Route> */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/appointments" element={<AppointmentsAdmin />} />
                    <Route path="/queue" element={<QueueAdmin />} />
                    <Route path="/queue-entry" element={<QueueEntry />} />
                    <Route path="/queue/:id" element={<QueueDetail />} />
                    <Route path="/queue/:queue_id/detail" element={<QueueDetail />} />
                    <Route path="/branch" element={<BranchManagement />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/services" element={<ServiceManagement />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/employee" element={<EmployeeManagement />} />
                    <Route path="/payouts" element={<Payouts />} />  
                    <Route path="/reports" element={<ReportManagement />} />
                    <Route path="*" element={<EmployeeLogin />} />
                  
              </Routes>
          </div>
      </>
  );
}


export default App;



/* import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppointmentsAdmin from './pages/AppointmentsAdmin';
import QueueAdmin from './pages/QueueAdmin';
import QueueEntry from './pages/QueueEntry';
import QueueDetail from './pages/QueueDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsAdmin />} />
        <Route path="/queue" element={<QueueAdmin />} />
        <Route path="/queue-entry" element={<QueueEntry />} />
        <Route path="/queue/:id" element={<QueueDetail />} />
        <Route path="/queue/:queue_id/detail" element={<QueueDetail />} />

        <Route path="*" element={<Login />} />  {/* ถ้าไม่มีเส้นทางอื่น ให้ Redirect ไปที่ Login *//*}
      </Routes>
    </Router>
  );
}

export default App; */
