import React, { useState, useEffect } from 'react';
import { checkSession } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { getQueue } from '../services/api';
import axios from 'axios';

const ReturnToLocker = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = await checkSession();
      if (!user) {
        navigate("/login");
        return;
      }

      setIsSuperAdmin(user.role === "superadmin");
      setSelectedBranch(user.role === "superadmin" ? null : user.branch_id);

      if (user.role !== "superadmin") {
        fetchQueue(user.branch_id);
      }
    };

    init();
  }, [navigate]);

  const fetchQueue = async (branchId) => {
    try {
      const res = await getQueue(branchId);
      const filtered = res.data.filter(item => item.status === 'เตรียมส่ง' && item.source === 'locker');
      console.log("Filtered Queue:", res.data);
      setQueue(filtered);
    } catch (error) {
      console.error("Error fetching locker queue:", error);
    }
  };

  const handleReturnToLocker = async (queueId) => {
    try {
      const res = await axios.post(`http://localhost:5000/locker/return`, {
        queue_id: queueId,
      });
      alert(`✅ คืนเข้าตู้สำเร็จที่ช่อง: ${res.data.slot_number}`);
      fetchQueue(selectedBranch);
    } catch (error) {
      console.error("Error returning to locker:", error);
      alert("❌ ไม่สามารถคืนใส่ตู้ได้");
    }
  };

  return (
    <div className="queue-container">
      <h1 className="mb-4">รายการส่งรองเท้าคืน Locker</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อ</th>
            <th>เบอร์โทร</th>
            <th>จำนวนคู่</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
            {queue.map((item, index) => (
                <tr key={item.queue_id}>
                <td>{index + 1}</td>
                <td>{item.customer_name}</td>
                <td>{item.phone}</td>
                <td>{item.total_pairs}</td>
                <td>{item.status}</td>
                <td>
                    <button className="btn btn-primary" onClick={() => handleReturnToLocker(item.queue_id)}>
                    คืนใส่ตู้
                    </button>
                </td>
                </tr>
            ))}
            </tbody>

      </table>
    </div>
  );
};

export default ReturnToLocker;
