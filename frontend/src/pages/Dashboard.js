import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueue, getAppointments, getBranches } from '../services/api';
import { jwtDecode } from "jwt-decode";
import './Dashboard.css';
import '../assets/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const statusColors = {
    'รับเข้า': '#FFCDD2',
    'อยู่ระหว่างทำความสะอาด': '#FFE0B2',
    'เตรียมส่ง': '#FFF9C4',
    'กำลังจัดส่ง': '#F8BBD0',
    'สำเร็จ': '#C8E6C9',
  };

  const appointmentColors = {
    'รอดำเนินการ': '#FFCDD2',
    'ยืนยันแล้ว': '#FFF9C4',
    'สำเร็จ': '#C8E6C9',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const user = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      //console.log("user:", user);
      if (user.exp && user.exp < now) {
       
        console.log("🔴 Token หมดอายุแล้ว! ต้องล็อกอินใหม่");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // ✅ เช็คว่าเป็น SuperAdmin หรือไม่
      const isSuperAdmin = user.isSuperAdmin;
      //setSelectedBranch(isSuperAdmin ? null : user.branch_id); 

      if (isSuperAdmin) {
        fetchBranches(); // ✅ โหลดรายการสาขา
      } else {
        setSelectedBranch(user.branch_id);
        fetchQueueData(user.branch_id);
        fetchAppointmentData(user.branch_id);
      }

    } catch (error) {
      console.error("🔴 Error decoding token:", error);
      navigate("/login");
      return;
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      //console.log("📌 Debug: Branches Data", res.data);
      setBranches(res.data);
    } catch (error) {
      console.error("🔴 Error fetching branches:", error);
    }
  };

  const fetchQueueData = async (branchId) => {
    try {
       // console.log("📌 Debug: Fetching queue data for branchId =", branchId);
        const res = await getQueue(branchId);
       // console.log("✅ Debug: Data received from API", res.data);
        const filteredQueue = res.data.filter(item => item.status !== "จัดส่งสำเร็จ");
       // console.log("fillter color:",res);
        setQueue(filteredQueue);
    } catch (error) {
        console.error("🔴 Error fetching queue data:", error.response?.data || error.message);
    } finally {
        setLoading(false);  // ✅ ทำให้ state loading เป็น false เมื่อโหลดข้อมูลเสร็จ
    }
};

 const fetchAppointmentData = async (branchId) => {
  try {
    //console.log("📌 Debug: Fetching appointment data for branchId =", branchId);
    const res = await getAppointments(branchId);
    const filteredAppointments = res.data.filter(appt => appt.status !== "สำเร็จ");
    //console.log("✅ Debug: Appointment Data", res.data);
    setAppointments(filteredAppointments);
  } catch (error) {
    console.error("🔴 Error fetching appointments:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  const handleBranchChange = (e) => {
    const branchId = e.target.value;

    setSelectedBranch(branchId);
    fetchQueueData(branchId);
    fetchAppointmentData(branchId);
  };

  return (
    <div className="dashboard-container">
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="text-left mb-4">📊 Dashboard</h1>

            {/* ✅ แสดง Dropdown ให้ SuperAdmin เลือกสาขา */}
            {branches.length > 0 && (
              <div className="mb-3">
                <label className="form-label">เลือกสาขา</label>
                <select className="form-control" value={selectedBranch || ''} onChange={handleBranchChange}>
                  <option value="">-- เลือกสาขา --</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
            )}

            {loading ? (
              <p>⏳ กำลังโหลดข้อมูลคิวงาน...</p>
            ) : (
              <>
                <section className="summary">
                  <p>คิวงานที่รอดำเนินการ: {queue.length} รายการ</p>
                  <p>นัดหมายที่รอดำเนินการ: {appointments.length} รายการ</p>
                </section>

                <div className="card">
                  <div className="card-body">
                    <h2>🔄 คิวงานที่รอดำเนินการ ({queue.length} รายการ)</h2>
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ลูกค้า</th>
                          <th>สถานที่</th>
                          <th>จำนวนคู่</th>
                          <th>วันที่รับ</th>
                          <th>วันที่ส่งคืน</th>
                          <th>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queue.map(item => (
                          <tr key={item.queue_id}>
                            <td>{item.customer_name}</td>
                            <td>{item.location}</td>
                            <td>{item.total_pairs}</td>
                            <td>{new Date(item.received_date).toLocaleDateString()}</td>
                            <td>{new Date(item.delivery_date).toLocaleDateString()}</td>
                            <td>
                            <span 
                                className="badge" 
                                style={{
                                  backgroundColor: statusColors[item.status] || '#ddd', 
                                  color: '#000',
                                  padding: '5px 10px', 
                                  borderRadius: '8px'
                                }}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {loading ? (
              <p>⏳ กำลังโหลดข้อมูลนัดหมาย...</p>
            ) : (
        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h2>📅 นัดหมายที่รอดำเนินการ ({appointments.length} รายการ)</h2>
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ลูกค้า</th>
                      <th>เบอร์โทร</th>
                      <th>สถานที่</th>
                      <th>วัน/เวลานัดหมาย</th>
                      <th>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appt => (
                      <tr key={appt.id}>
                        <td>{appt.customer_name}</td>
                        <td>{appt.phone}</td>
                        <td>{appt.location}</td>
                        <td>{new Date(appt.appointment_date).toLocaleDateString()}{" "}{appt.appointment_time.slice(0,5)} น.</td>
                        <td>
                        <span 
                            className="badge" 
                            style={{
                              backgroundColor: appointmentColors[appt.status] || '#ddd', 
                              color: '#000',
                              padding: '5px 10px', 
                              borderRadius: '8px'
                            }}>
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
            )}
      </div>
    </div>
  );
};

export default Dashboard;
