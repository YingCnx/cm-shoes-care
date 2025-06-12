import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getQueue, getAppointments, getBranches, getReports, backupdb  } from '../services/api';
import { jwtDecode } from "jwt-decode";
import './Dashboard.css';
import '../assets/css/bootstrap.min.css';
import AnnounceModal from '../components/AnnounceModal'; // เพิ่มการ import
import { checkSession } from '../services/authService'; // ✅ เพิ่ม
import { FaMoneyBill, FaMoneyCheckAlt, FaListUl, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';



const Dashboard = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [countshoes, setCountshoes] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [workdaily, setWorkdaily] = useState([]);
  const [incomesdaily, setIncomesdaily] = useState({ totalIncome: 0 });
  const [incomesMonthly, setIncomesMonthly] = useState({ totalIncomeMonthly: 0 }); // Changed to totalIncomeMonthly
  const [payoutsMonthly, setPayoutsMonthly] = useState({ totalPayoutMonthly: 0 }); // New state for monthly payouts

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date()); // ✅ Add state for current time

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementData, setAnnouncementData] = useState([]);

  const statusColors = {
    'รับเข้า': '#96CFCF',
    'อยู่ระหว่างทำความสะอาด': '#AFD7F6',
    'เตรียมส่ง': '#FBCCE0',
    'กำลังจัดส่ง': '#EFA375',
    'สำเร็จ': '#2EBDBD',
  };

  const appointmentColors = {
    'รอดำเนินการ': '#FFCDD2',
    'ยืนยันแล้ว': '#FFF9C4',
    'สำเร็จ': '#C8E6C9',
  };

  useEffect(() => {
  const init = async () => {
    const user = await checkSession();

    if (!user) {
      // ✅ ป้องกัน error: ทำผ่าน setTimeout หรือลบ navigate
      setTimeout(() => navigate('/login'), 0);
      return;
    }

    const isSuperAdmin = user.role === "superadmin";

    if (isSuperAdmin) {
      fetchBranches();
    } else {
      setSelectedBranch(user.branch_id);
      fetchQueueData(user.branch_id);
      fetchAppointmentData(user.branch_id);        
      getIncomesdaily(user.branch_id);
      getIncomesMonthly(user.branch_id);
      getPayoutsMonthly(user.branch_id);
    }
  };

  init();
}, [navigate]);



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
        const totalPairs = filteredQueue.reduce((sum, item) => sum + (item.total_pairs || 0), 0);
        //console.log("Total pairs:", totalPairs);

        setCountshoes(totalPairs);
        setQueue(filteredQueue);
        getWorkdaily(res);
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

    fetchAnnouncement(filteredAppointments);
    
  } catch (error) {
    console.error("🔴 Error fetching appointments:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

const fetchAnnouncement = async (dtappointment) => {
  try {
    const today = new Date().toLocaleDateString('en-CA');

    const todayAppointments = dtappointment
      .filter(appt =>
        new Date(appt.appointment_date).toLocaleDateString('en-CA') === today
      )
      .sort((a, b) => {
        const [hourA, minA] = a.appointment_time.split(':').map(Number);
        const [hourB, minB] = b.appointment_time.split(':').map(Number);

        const dateA = new Date(a.appointment_date);
        const dateB = new Date(b.appointment_date);

        dateA.setHours(hourA, minA, 0, 0);
        dateB.setHours(hourB, minB, 0, 0);

        return dateA - dateB;
      });

    if (todayAppointments.length > 0) {
      setAnnouncementData(todayAppointments);
      setShowAnnouncement(true);
    }
  } catch (error) {
    console.error("🔴 Error fetching announcements:", error);
  }
};




const getWorkdaily = (queue) => {
  // Filter queue items for status "อยู่ระหว่างทำความสะอาด"
  const workingQueue = queue.data.filter(item => item.status === "อยู่ระหว่างทำความสะอาด");

  // Count the number of queue items with the status "อยู่ระหว่างทำความสะอาด"
  const queueCount = workingQueue.length;

  // Sum the total_pairs for queue items with the status "อยู่ระหว่างทำความสะอาด"
  const totalPairs = workingQueue.reduce((sum, item) => sum + item.total_pairs, 0);

  // Update the state with the calculated values
  setWorkdaily({
    queueCount: queueCount,
    totalPairs: totalPairs
  });
};

const getIncomesdaily = async (branchId) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of the day (00:00:00)

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59.999)

    // Format date and time to local time string (e.g., '2023-10-27', '00:00:00')
    const startOfDayString = startOfDay.toLocaleDateString('en-CA') + ' ' + startOfDay.toLocaleTimeString('en-CA', { hour12: false }); // Example: '2023-10-27 00:00:00'
    const endOfDayString = endOfDay.toLocaleDateString('en-CA') + ' ' + endOfDay.toLocaleTimeString('en-CA', { hour12: false });// Example: '2023-10-27 23:59:59'
    // or if you need the date and time to be in this format "2023-10-27T23:59:59"

    //console.log("startdate",startOfDayString);
    //console.log("enddate",endOfDayString);
    const res = await getReports({
      branch_id: branchId,
      report_type: "income",
      start_date: startOfDayString,
      end_date: endOfDayString,
    });

    // Process the response data to calculate the total income for today
    let totalIncome = 0;
    if (res.data && Array.isArray(res.data)) {
      res.data.forEach(item => {
        if (item.total_amount) {
          totalIncome += parseFloat(item.total_amount);
        }
      });
    }
    // Update the state with the calculated total income
    setIncomesdaily({
      totalIncome: totalIncome,
    });
  } catch (error) {
    console.error("🔴 Error fetching daily income:", error);
    setIncomesdaily({
      totalIncome: 0,
    });
  }
};

const getIncomesMonthly = async (branchId) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    const startOfMonthString = firstDayOfMonth.toLocaleDateString('en-CA') + ' ' + firstDayOfMonth.toLocaleTimeString('en-CA', { hour12: false });
    const endOfMonthString = lastDayOfMonth.toLocaleDateString('en-CA') + ' ' + lastDayOfMonth.toLocaleTimeString('en-CA', { hour12: false });

    //console.log("startdate",startOfMonthString);
    //console.log("enddate",endOfMonthString);
    const res = await getReports({
      branch_id: branchId,
      report_type: "income",
      start_date: startOfMonthString,
      end_date: endOfMonthString,
    });

    let totalIncomeMonthly = 0;
    if (res.data && Array.isArray(res.data)) {
      res.data.forEach(item => {
        if (item.total_amount) {
          totalIncomeMonthly += parseFloat(item.total_amount);
        }
      });
    }

    setIncomesMonthly({ totalIncomeMonthly });
  } catch (error) {
    console.error("🔴 Error fetching monthly income:", error);
    setIncomesMonthly({ totalIncomeMonthly: 0 });
  }
};

const getPayoutsMonthly = async (branchId) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const startOfMonthString = firstDayOfMonth.toLocaleDateString('en-CA') + ' ' + firstDayOfMonth.toLocaleTimeString('en-CA', { hour12: false });
    const endOfMonthString = lastDayOfMonth.toLocaleDateString('en-CA') + ' ' + lastDayOfMonth.toLocaleTimeString('en-CA', { hour12: false });

    //console.log("startdate",startOfMonthString);
    //console.log("enddate",endOfMonthString);
    const res = await getReports({
      branch_id: branchId,
      report_type: "payout", // Changed to "payout"
      start_date: startOfMonthString,
      end_date: endOfMonthString,
    });
    
    let totalPayoutMonthly = 0;
    if (res.data && Array.isArray(res.data)) {
      res.data.forEach(item => {
        if (item.amount) {
          totalPayoutMonthly += parseFloat(item.amount);
        }
      });
    }

    
    setPayoutsMonthly({ totalPayoutMonthly });
  } catch (error) {
    console.error("🔴 Error fetching monthly payouts:", error);
    setPayoutsMonthly({ totalPayoutMonthly: 0 });
  }
};

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    fetchQueueData(branchId);
    fetchAppointmentData(branchId);
    getIncomesMonthly(branchId);
    getPayoutsMonthly(branchId);
  };

const handleBackup = async () => {
  try {
    const res = await backupdb()
    const blob = new Blob([res.data], { type: "application/octet-stream" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cmshoes-backup-${new Date().toISOString().slice(0, 10)}.dump`
    a.click()
  } catch (error) {
    console.error("❌ Backup failed:", error)
    alert("เกิดข้อผิดพลาดในการสำรองข้อมูล")
  }
}

  return (

    <div className="dashboard-container">
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-lg-12">     
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
     {/* ✅ Summary Cards */}
              {/*  <section className="summary-cards">
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title"><FaMoneyBill />  รายรับเดือนนี้</h5>
                      <p className="card-text">{incomesMonthly.totalIncomeMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
                    </div>
                  </div>
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title"><FaMoneyCheckAlt />  รายจ่ายเดือนนี้</h5>
                      <p className="card-text">{payoutsMonthly.totalPayoutMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
                    </div>
                  </div>                
                </section>
                <section className="summary-cards">
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">คิวงานที่รอดำเนินการ</h5>
                      <p className="card-text">{queue.length} รายการ</p>
                    </div>
                  </div>
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">นัดหมายที่รอดำเนินการ</h5>
                      <p className="card-text">{appointments.length} รายการ</p>
                    </div>
                  </div>
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">งานวันนี้</h5>
                      <p className="card-text">{workdaily.queueCount} รายการ {workdaily.totalPairs} คู่</p>
                    </div>
                  </div>
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">รายรับวันนี้</h5>
                      <p className="card-text">{incomesdaily.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
                    </div>
                  </div>
                </section> */}
           {/* Summary Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body text-center">
                      <FaMoneyBill className="text-success fs-3 mb-2" />
                      <h6 className="fw-bold">รายรับเดือนนี้</h6>
                      <p className="fs-5">{incomesMonthly.totalIncomeMonthly.toLocaleString()} บาท</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body text-center">
                      <FaMoneyCheckAlt className="text-danger fs-3 mb-2" />
                      <h6 className="fw-bold">รายจ่ายเดือนนี้</h6>
                      <p className="fs-5">{payoutsMonthly.totalPayoutMonthly.toLocaleString()} บาท</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body text-center">
                      <FaListUl className="text-primary fs-3 mb-2" />
                      <h6 className="fw-bold">คิวงานที่รอดำเนินการ</h6>
                      <p className="fs-5">{queue.length} รายการ {countshoes} คู่</p> 
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body text-center">
                      <FaCalendarAlt className="text-warning fs-3 mb-2" />
                      <h6 className="fw-bold">รายรับวันนี้</h6>
                      <p className="fs-5">{incomesdaily.totalIncome.toLocaleString()} บาท</p>
                    </div>
                  </div>
                </div>
              </div>
                

              <div className="card queue-card">
                <div className="card-body">
                  <h2 className="card-title mb-4">🔄 คิวงานที่รอดำเนินการ ({queue.length} รายการ)</h2>

                    <table className="table table-hover table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>ลูกค้า</th>
                          <th>สถานที่</th>
                          <th>จำนวนคู่</th>
                          <th>วันที่รับ</th>
                          <th>วันที่ส่งคืน</th>
                          <th>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queue.map((item, index) => (
                          <tr
                            key={item.queue_id}
                            onClick={() => window.location.href = `/queue/${item.queue_id}/detail`}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{index + 1}</td>
                            <td>{item.customer_name}</td>
                            <td>{item.location}</td>
                            <td>{item.total_pairs}</td>
                            <td>{new Date(item.received_date).toLocaleDateString()}</td>
                            <td>
                              {new Date(item.delivery_date) <= new Date().setHours(0, 0, 0, 0) ? (
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  {new Date(item.delivery_date).toLocaleDateString()}
                                </span>
                              ) : (
                                new Date(item.delivery_date).toLocaleDateString()
                              )}
                            </td>
                            <td>
                              <span
                                className="badge-status"
                                style={{
                                  backgroundColor: statusColors[item.status] || '#ddd',
                                }}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <button className="btn btn-outline-secondary" onClick={handleBackup}>
                        Backup Database
                      </button>
                    </div>
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
                  <thead>
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
      <AnnounceModal
        show={showAnnouncement}
        onClose={() => setShowAnnouncement(false)}
        title="นัดหมายวันนี้"
        appointments={announcementData}
      />
    </div>
  );
};

export default Dashboard;
