import React, { useState, useEffect } from 'react';
import { checkSession } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { getAppointments, createQueue, updateAppointmentQueueId, getBranches, getCustomers, createCustomer, getAllLockerDrops ,updateLockerDropQueueId} from '../services/api';
import '../assets/css/bootstrap.min.css';
import './QueueEntry.css';
import Select from "react-select";
import AddCustomerModal from "../components/AddCustomerModal";
import {  FaPlus } from 'react-icons/fa';

const QueueEntry = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [lockerDrops, setLockerDrops] = useState([]);
    const [branches, setBranches] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [source, setSource] = useState(''); 
    const [location, setLocation] = useState('Walk-in');
    const [totalPairs, setTotalPairs] = useState(1);
    const [recieveDate, setRecieveDate] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    });

    const [deliveryDate, setDeliveryDate] = useState(() => {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        return threeDaysFromNow.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    });

    const [lockerId, setLockerId] = useState(null);
    const [slotId, setSlotId] = useState(null);

    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedLockerDropId, setSelectedLockerDropId] = useState(null);

    const [selectedBranch, setSelectedBranch] = useState("");

    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");

    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [branchesForModal, setBranchesForModal] = useState([]);

    
    useEffect(() => {
        const init = async () => {
            const sessionUser = await checkSession();
            if (!sessionUser) {
                alert("กรุณาเข้าสู่ระบบ");
                navigate("/login");
                return;
            }

            setUser(sessionUser);
            const admin = sessionUser.role === "superadmin";
            setIsAdmin(admin);
            const branchId = admin ? "" : sessionUser.branch_id;
            setSelectedBranch(branchId);

            if (admin) fetchBranches();
            if (branchId) {
                fetchAppointments(branchId);
                fetchCustomers(branchId);
            }
        };

        init();
    }, [navigate]);

    useEffect(() => {
        if (selectedBranch) {
          fetchLockerDrops(selectedBranch);
            fetchAppointments(selectedBranch);
            fetchCustomers(selectedBranch);
        }
        else {
            fetchLockerDrops();
            fetchAppointments();
        }
    }, [selectedBranch]);

    const fetchCustomers = async (branchId) => {
        try {

            const res = await getCustomers(branchId);

            setCustomers(res.data);
        } catch (err) {
            console.error("🔴 Error loading customers:", err);
        }
    };

  const fetchLockerDrops = async (branchId) => {
  try {
    const res = await getAllLockerDrops(branchId);
    setLockerDrops(res.data);
  } catch (err) {
    console.error("🔴 Error fetching locker drops:", err);
  }
};


    const fetchAppointments = async (branchId) => {
        try {
            const res = await getAppointments();

            let filteredAppointments = res.data.filter(appt =>
              appt.status === 'สำเร็จ' &&
              (!appt.queue_id || appt.queue_id === null) &&
              appt.type === 'pickup'
            );

            // ✅ กรองตาม branch_id ที่เลือก
            filteredAppointments = filteredAppointments.filter(appt => appt.branch_id === branchId);

            setAppointments(filteredAppointments);
        } catch (error) {
            console.error("🔴 Error fetching appointments:", error);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            //console.log("📌 Debug: Branches Data", res.data);

            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
            alert("❌ ไม่สามารถโหลดข้อมูลสาขาได้");
        }
    };

    const handleCreateQueue = async () => {
        const branch_id = isAdmin ? selectedBranch : user?.branch_id;

        // ✅ SuperAdmin ต้องเลือกสาขา
        if (isAdmin && !selectedBranch) {
            alert("❌ กรุณาเลือกสาขาก่อนทำรายการ");
            return;
        }

        if (!customerId || !customerName || !phone || !totalPairs || !recieveDate || !deliveryDate || !branch_id) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการบันทึกคิวนี้?")) return;

        try {
            const newQueue = {
                customer_id: customerId,
                customer_name: customerName,
                phone,
                source: source,
                location,
                total_pairs: totalPairs,
                received_date: recieveDate,
                delivery_date: deliveryDate,
                branch_id,
                locker_id: lockerId,
                slot_id: slotId
            };

            const response = await createQueue(newQueue);
            const queue_id = response.queue_id;

            if (selectedAppointmentId) {
                await updateAppointmentQueueId(selectedAppointmentId, queue_id);
            }

            if(selectedLockerDropId) {
                await updateLockerDropQueueId(selectedLockerDropId, queue_id);
            }

            alert("✅ เพิ่มคิวงานเรียบร้อยแล้ว!");
            navigate('/queue');
        } catch (err) {
            console.error("🔴 Error creating queue:", err);
            alert("❌ มีข้อผิดพลาดในการบันทึกคิว");
        }
    };

    const handleSaveNewCustomer = async (customerData) => {
        try {
            const res = customerData.id
                ? await updateCustomer(customerData.id, customerData)
                : await createCustomer(customerData);

            if (res.status === 201 || res.status === 200) {
                alert("✅ บันทึกข้อมูลลูกค้าสำเร็จ!");
                setShowAddCustomerModal(false);
                fetchCustomers(selectedBranch); // โหลดใหม่
                setCustomerName(res.data.name);
                setPhone(res.data.phone);
                setSource(res.data.origin_source);
                setLocation(res.data.address || "Walk-in");
                setCustomerId(res.data.id);
            } else {
                alert("❌ ไม่สามารถบันทึกข้อมูลลูกค้าได้");
            }
        } catch (err) {
            console.error("🔴 Error saving new customer:", err);
            alert("❌ เกิดข้อผิดพลาดในการบันทึกลูกค้า");
        }
    };

    const handleSelectAppointment = (appointment) => {
        handleClearForm();
        setCustomerId(appointment.customer_id);
        setCustomerName(appointment.customer_name);
        setPhone(appointment.phone);
        setSource(appointment.source);
        setLocation(appointment.location || "Walk-in");
        setTotalPairs(appointment.shoe_count);
        setSelectedAppointmentId(appointment.id);
    };

    const handleSelectLocker = (drop) => {
      handleClearForm();
      setCustomerId(drop.customer_id);
      setCustomerName(drop.customer_name);
      setPhone(drop.phone);
      setSource("locker");
      setLocation(`Locker ${drop.locker_name}`);
      setTotalPairs(drop.total_pairs || 1);
      setSelectedLockerDropId(drop.id);
      setLockerId(drop.locker_id);
      setSlotId(drop.slot_id);
    };

    const handleClearForm = () => {
        setCustomerId('');
        setCustomerName('');
        setPhone('');
        setSource('');
        setLocation('Walk-in');
        setTotalPairs(1);
        setDeliveryDate(() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 3);
            return tomorrow.toISOString().split('T')[0];
        });
        setSelectedAppointmentId(null);
    };


    return (
<div className="queue-container">
    <div className="d-flex justify-content-between align-items-center"> {/* ✅ Container for date/time and title */}
             <div>
                <br/>
                <h2> รับเข้าใหม่</h2>
             </div>
          </div>
  <div className="queue-flex-wrapper">
    
    {/* ฝั่งซ้าย: เลือกจากนัดหมาย */}
    <div className="queue-left d-flex flex-column" style={{ height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
      <h2 className="mb-3">📅 เลือกจากนัดหมาย</h2>
      {isAdmin && (
        <div className="mb-3">
          <label className="form-label">เลือกสาขา</label>
          <select
            className="form-select"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(Number(e.target.value))}
          >
            <option value="">-- กรุณาเลือกสาขา --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>เบอร์โทร</th>
            <th>จำนวนคู่</th>
            <th>เลือก</th>
          </tr>
        </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr className="table-light">
                <td colSpan="4" className="text-center text-muted py-3" style={{ cursor: 'default' }}>
                  ไม่มีนัดหมายสำหรับเพิ่มคิวใหม่
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.customer_name}</td>
                  <td>{appt.phone}</td>
                  <td>{appt.shoe_count}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSelectAppointment(appt)}
                    >
                      เลือก
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
      </table>
    </div>
   
    {/* ส่วนล่าง: Locker */}
  <div style={{ flex: 1, overflowY: 'auto', borderTop: '2px solid #ddd', marginTop: '1rem', paddingTop: '1rem' }}>
    <h2 className="mb-3">📦 เลือกจาก Locker</h2>
    {/* ✅ TODO: เพิ่มตาราง lockerDrop ที่ fetch มา */}
    <table className="table table-hover">
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>เบอร์โทร</th>
          <th>ตู้</th>
          <th>จำนวนคู่</th>
          <th>เลือก</th>
        </tr>
      </thead>
        <tbody>
          {lockerDrops.length === 0 ? (
          <tr style={{ cursor: 'default' }} className="table-light">
            <td colSpan="5" className="text-center text-muted py-3">
              ไม่มีรองเท้าที่รอรับจากตู้
            </td>
          </tr>
          ) : (
            lockerDrops.map(drop => (
              <tr key={drop.id}>
                <td>{drop.customer_name || '-'}</td>
                <td>{drop.phone}</td>
                <td>Locker {drop.locker_name}</td>
                <td>{drop.total_pairs}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSelectLocker(drop)}
                  >
                    เลือก
                  </button>
                </td>
              </tr>
            ))
          )}
    </tbody>
    </table>
  </div>
  </div>


    {/* ฝั่งขวา: เพิ่มคิวใหม่ */}
    <div className="queue-right">
      <h2 className="mb-3">🆕 เพิ่มคิวใหม่ (Walk-in)</h2>

    <div className="mb-3">
    <label className="form-label">🔍 ค้นหาลูกค้า (จากประวัติ)</label>
    <div className="d-flex gap-2 align-items-center">
        <div className="flex-grow-1">
        <Select
            options={customers.map((c) => ({
            label: `${c.name || "-"} | ${c.phone || "-"} | ${c.address || "-"}`,
            value: c.id,
            data: c,
            }))}
            value={null}
            onChange={(selected) => {
            if (selected?.data) {
                const customer = selected.data;
                setCustomerId(customer.id);
                setCustomerName(customer.name);
                setPhone(customer.phone);
                setSource(customer.origin_source);
                setLocation(customer.address || "Walk-in");
            } else {
                setCustomerId("");
                setCustomerName("");
                setPhone("");
                setLocation("Walk-in");
            }
            }}
            onMenuOpen={() => {
            handleClearForm();
            }}
            isClearable
            placeholder="พิมพ์ชื่อ / เบอร์โทร / สถานที่..."
            className="react-select-container"
            classNamePrefix="react-select"
            filterOption={(option, input) =>
            option.label.toLowerCase().includes(input.toLowerCase())
            }
        />
        </div>
        <button
        className="btn btn-primary"
        onClick={() => {
            setCustomerName("");
            setPhone("");
            setLocation("Walk-in");
            setCustomerId("");
            setShowAddCustomerModal(true);
        }}
        >
        <FaPlus style={{ marginRight: "6px" }} />
        เพิ่มลูกค้า
        </button>
    </div>
    </div>


      <div className="mb-2">
        <label className="form-label">ชื่อ</label>
        <input type="text" className="form-control" value={customerName} readOnly />
      </div>
      <div className="mb-2">
        <label className="form-label">เบอร์โทร</label>
        <input type="text" className="form-control" value={phone} readOnly />
      </div>
      <div className="mb-2">
        <label className="form-label">ช่องทาง</label>
        <input type="text" className="form-control" value={source} readOnly />
      </div>
      <div className="mb-2">
        <label className="form-label">สถานที่</label>
        <input
          type="text"
          className="form-control"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">จำนวนคู่รองเท้า</label>
        <input
          type="number"
          className="form-control"
          value={totalPairs}
          onChange={(e) => setTotalPairs(Number(e.target.value))}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">วันที่รับเข้า</label>
        <input
          type="date"
          className="form-control"
          value={recieveDate}
          onChange={(e) => setRecieveDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">กำหนดส่งคืน</label>
        <input
          type="date"
          className="form-control"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-danger w-50" onClick={handleClearForm}>
          ❌ ล้างฟอร์ม
        </button>
        <button className="btn btn-success w-50" onClick={handleCreateQueue}>
          ✅ บันทึกคิว
        </button>
      </div>
    </div>
  </div>

  {/* ✅ Modal สำหรับเพิ่มลูกค้าใหม่ */}
  {showAddCustomerModal && (
    <AddCustomerModal
      show={showAddCustomerModal}
      onClose={() => setShowAddCustomerModal(false)}
      onSave={handleSaveNewCustomer}
      customerData={null}
      branches={branches}
      isSuperAdmin={isAdmin}
    />
  )}
</div>

    );
};

export default QueueEntry;
