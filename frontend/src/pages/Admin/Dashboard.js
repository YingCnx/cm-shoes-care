import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueue, getAppointments, createAdmin } from '../services/api';
import './Dashboard.css';
import '../assets/css/bootstrap.min.css';



const statusColors = {
  'รับเข้า': '#FFCDD2', // แดงพาสเทล
  'อยู่ระหว่างทำความสะอาด': '#FFE0B2', // ส้มพาสเทล
  'เตรียมส่ง': '#FFF9C4', // เหลืองพาสเทล
  'กำลังจัดส่ง': '#F8BBD0', // ชมพูพาสเทล
  'สำเร็จ': '#C8E6C9', // เขียวพาสเทล
};

const appointmentColors = {
  'รอดำเนินการ': '#FFCDD2', // แดงพาสเทล
  'ยืนยันแล้ว': '#FFF9C4', // เหลืองพาสเทล
  'สำเร็จ': '#C8E6C9', // เขียวพาสเทล
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchQueueData();
    fetchAppointmentData();
  }, []);

  const fetchQueueData = async () => {
    try {
      const res = await getQueue();
      const filteredQueue = res.data.filter(item => Object.keys(statusColors).includes(item.status));
      console.log("queue:",filteredQueue);
      setQueue(filteredQueue);
    } catch (error) {
      console.error('🔴 Error fetching queue data:', error);
    }
  };

  const fetchAppointmentData = async () => {
    try {
      const res = await getAppointments();
      const filteredAppointments = res.data.filter(appt => Object.keys(appointmentColors).includes(appt.status));
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error('🔴 Error fetching appointments:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-lg-12">
          <h1 className="text-left mb-4">📊 Dashboard</h1>
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
                      <td><span className={statusColors[item.status]}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
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
                      <td><span className={appointmentColors[appt.status]}>{appt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


export default Dashboard;
