import React, { useState, useEffect } from "react";
import { getPayouts, createPayout, updatePayout, deletePayout, getBranches } from "../services/api";
import { jwtDecode } from "jwt-decode"; 
import "bootstrap/dist/css/bootstrap.min.css";

const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const Payouts = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const [payouts, setPayouts] = useState([]);
    const [branches, setBranches] = useState([""]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [employeeId, setemployeeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        id: null,
        payout_type: "",
        description: "",
        amount: "",
        notes: "",
        payout_date: "",
        branch_id: "",
        employee_id: null,
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // ปรับ TimeZone Offset
        return date.toISOString().split("T")[0]; // คืนค่าเป็น YYYY-MM-DD
    };
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const user = jwtDecode(token);
          
            setIsSuperAdmin(user.isSuperAdmin);
            setSelectedBranch(user.isSuperAdmin ? "" : user.branch_id); 
            setemployeeId(user.id ?? null); 

            if (user.isSuperAdmin) fetchBranches();
        } catch (error) {
            console.error("🔴 Error decoding token:", error);
        }
    }, []);

    useEffect(() => {
        if (selectedBranch || !isSuperAdmin) {
            fetchPayouts();
        }
    }, [selectedYear, selectedMonth, selectedBranch]);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };

    const fetchPayouts = async () => {
        if (!selectedBranch) return; // ✅ ไม่โหลดถ้ายังไม่เลือกประเภท   
        try {
            setLoading(true);
            const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
            const endDate = new Date(selectedYear, selectedMonth, 1).toISOString().split("T")[0];

            //console.log(`📌 Fetching Payouts for: ${selectedYear} ${THAI_MONTHS[selectedMonth - 1]} (${startDate} to ${endDate})`);

            const res = await getPayouts({
                start_date: startDate,
                end_date: endDate,
                branch_id: selectedBranch || null, // ส่ง branch_id ไปเฉพาะถ้าเลือก
            });

            setPayouts(res.data);
        } catch (error) {
            console.error("🔴 Error fetching payouts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                  // ✅ ตรวจสอบว่าทุกช่องข้อมูลสำคัญถูกกรอกครบถ้วน
        if (!form.payout_type || !form.description || !form.amount || !form.payout_date) {
            alert(selectedBranch);
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน รวมถึงวันที่จ่ายเงิน!");
            return;
        }

        // ✅ ตรวจสอบว่าค่าจำนวนเงินต้องเป็นตัวเลข และมากกว่า 0
        if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
            alert("❌ กรุณากรอกจำนวนเงินให้ถูกต้อง!");
            return;
        }

            const payload = {
                ...form,
                branch_id: isSuperAdmin ? form.branch_id : selectedBranch,
                employee_id: employeeId,
            };

            //console.log("form data:",form);

            const confirmSave = window.confirm(form.id 
                ? `📌 คุณต้องการอัปเดตข้อมูลรายจ่าย "${form.description}" หรือไม่?`
                : `📌 คุณต้องการบันทึกข้อมูลรายจ่าย "${form.description}" หรือไม่?`);
            
            if (!confirmSave) return;

            if (form.id) {
                await updatePayout(form.id, payload);
                alert("✅ อัปเดตรายจ่ายเรียบร้อย!");
            } else {
                await createPayout(payload);
                alert("✅ เพิ่มรายจ่ายเรียบร้อย!");
            }

            fetchPayouts();
            setShowModal(false);
            setForm({ id: null, payout_type: "", description: "", amount: "", notes: "", payout_date: "", branch_id: "" });
        } catch (error) {
            console.error("🔴 Error saving payout:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
            try {
                await deletePayout(id);
                alert("✅ ลบรายการเรียบร้อย!");
                fetchPayouts();
                setForm({ id: null, payout_type: "", description: "", amount: "", notes: "", payout_date: "", branch_id: "" });
            } catch (error) {
                console.error("🔴 Error deleting payout:", error);
            }
        }
    };

    const totalAmount = payouts.reduce((sum, payout) => sum + parseFloat(payout.amount || 0), 0);

    return (
        <div className="container mt-4">
            <h1>📉 รายจ่าย</h1>
            <button className="btn btn-primary mb-3"  onClick={() => {
                    setForm({
                        id: null,
                        payout_type: "",
                        description: "",
                        amount: "",
                        notes: "",
                        payout_date: "",
                        branch_id: "",
                        employee_id: null,
                    }); // รีเซ็ตค่า form เป็นค่าเริ่มต้น
                    setShowModal(true);
                }}>➕ เพิ่มรายจ่าย</button>

            <div className="card p-3 mb-3 shadow">
                <div className="row">
                    {isSuperAdmin && (
                        <div className="col-md-3">
                            <label className="form-label">เลือกสาขา</label>
                            <select className="form-select" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                                <option value="">-- ทุกสาขา --</option>
                                {branches.map(branch => (
                                    <option key={`branch-${branch.id}`} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="col-md-3">
                        <label className="form-label">เลือกปี</label>
                        <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">เลือกเดือน</label>
                        <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                            {THAI_MONTHS.map((month, index) => (
                                <option key={`month-${index}`} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={fetchPayouts}>
                            🔍 ค้นหา
                        </button>
                    </div>
                </div>
            </div>

            <div className="card p-3 shadow">
                <h5>📋 รายจ่าย ประจำเดือน {THAI_MONTHS[selectedMonth - 1]} {selectedYear}</h5>
                {loading ? (
                    <div className="text-center py-3">⏳ กำลังโหลดข้อมูล...</div>
                ) : (
                    <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>วันที่</th>
                            <th>ประเภท</th>
                            <th>รายละเอียด</th>
                            <th>จำนวนเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.length > 0 ? (
                            payouts.map((payout) => (
                                <tr 
                                    key={`payout-${payout.id}`} 
                                    onClick={() => {
                                        setForm(payout);
                                        setShowModal(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{new Date(payout.payout_date).toLocaleDateString()}</td>
                                    <td>{payout.payout_type}</td>
                                    <td>{payout.description}</td>
                                    <td>{parseFloat(payout.amount).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">ไม่มีข้อมูลรายจ่าย</td>
                            </tr>
                        )}
                    </tbody>
                    {payouts.length > 0 && (
                        <tfoot>
                            <tr className="table-dark">
                                <td colSpan="3" className="text-end fw-bold">รวม</td>
                                <td className="fw-bold">{parseFloat(totalAmount).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
                )}
            </div>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{form.id ? "🔄 อัปเดตรายจ่าย" : "➕ เพิ่มรายจ่าย"}</h4>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {/* ✅ หากเป็น SuperAdmin ให้เลือกสาขา */}
                                    {isSuperAdmin && !form.id && (
                                        <div className="mb-3">
                                            <label className="form-label">เลือกสาขา</label>
                                            <select 
                                                className="form-control" 
                                                value={form.branch_id} 
                                                onChange={(e) => setForm({ ...form, branch_id: e.target.value })} 
                                                required
                                            >
                                                <option value="">-- เลือกสาขา --</option>
                                                {branches.map(branch => (
                                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* ✅ หากเป็น Employee ให้กำหนด branch_id อัตโนมัติ */}
                                    {!isSuperAdmin && !form.id && (
                                        <input type="hidden" value={selectedBranch} readOnly />
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label">ประเภท</label>
                                        <select className="form-control" value={form.payout_type} onChange={(e) => setForm({ ...form, payout_type: e.target.value })} required>
                                            <option value="">-- เลือกประเภท --</option>
                                            <option value="รายเดือน">รายเดือน</option>
                                            <option value="อุปกรณ์-น้ำยา">อุปกรณ์-น้ำยา</option>
                                            <option value="อื่นๆ">อื่นๆ</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">รายละเอียด</label>
                                        <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">จำนวนเงิน (บาท)</label>
                                        <input type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">วันที่จ่ายเงิน</label>
                                        <input 
                                            type="date"
                                            className="form-control"
                                            name="payout_date"
                                            value={form.payout_date ? formatDate(form.payout_date) : ""}
                                            onChange={(e) => setForm({ ...form, payout_date: e.target.value })}
                                        />              
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">หมายเหตุ</label>
                                        <textarea className="form-control" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}></textarea>
                                    </div>

                                    <div className="modal-footer">
                       
                                    {form.id && (
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(form.id)}
                                        >
                                            🗑 ลบ
                                        </button>
                                    )}
                                        <button type="submit" className="btn btn-primary">{form.id ? "อัปเดต" : "บันทึก"}</button>
                                        
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Payouts;
