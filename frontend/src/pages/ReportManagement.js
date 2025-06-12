import React, { useState, useEffect } from "react";
import { checkSession } from "../services/authService";
import { getReports, getBranches } from "../services/api"; // API เรียกรายงานและดึงสาขา
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import ReportTable from "../components/ReportTable";

const ReportManagement = () => {

    const firstDay = new Date();
    firstDay.setDate(1); // ตั้งค่าให้เป็นวันที่ 1
    const today = new Date();
    const firstDayOfMonth =  firstDay.toISOString().split('T')[0];
    const currentDate = today.toISOString().split("T")[0];

    const [reports, setReports] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(""); // ✅ ใช้ "" แทน null
    const [selectedReportType, setSelectedReportType] = useState(""); // ✅ ใช้ "" แทน null
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(currentDate);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const [loading, setLoading] = useState(false); // ✅ สถานะโหลดข้อมูล

    useEffect(() => {
        const init = async () => {
        const user = await checkSession();
        if (!user) return;

        const isSuperAdmin = user.role === "superadmin";
        setIsSuperAdmin(isSuperAdmin);
        setSelectedBranch(isSuperAdmin ? "" : user.branch_id);

        if (isSuperAdmin) fetchBranches();
    };

    init();
    }, []);

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        setSelectedBranch(branchId);
    
        // ✅ ค้นหาชื่อสาขาที่ตรงกับ branchId
        const branch = branches.find(branch => branch.id.toString() === branchId.toString());
        setSelectedBranchName(branch ? branch.name : "ทุกสาขา");
        fetchReports();
        console.log("📌 Debug: Selected Branch Name =", branch ? branch.name : "ทุกสาขา");
    };

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };

    const fetchReports = async () => {
        try {
            if (!selectedReportType) return;
        
            setLoading(true);
        
            // Convert startDate to a Date object
            const start = new Date(startDate);
            // Ensure the time component is set to the beginning of the day (00:00:00)
            start.setHours(0, 0, 0, 0);
            const startOfDayString = start.toLocaleDateString('en-CA') + ' ' + start.toLocaleTimeString('en-CA', { hour12: false });
        
            // Convert endDate to a Date object
            const end = new Date(endDate);
            // Ensure the time component is set to the end of the day (23:59:59.999)
            end.setHours(23, 59, 59, 999);
            const endOfDayString = end.toLocaleDateString('en-CA') + ' ' + end.toLocaleTimeString('en-CA', { hour12: false });
        
            const res = await getReports({
              branch_id: selectedBranch,
              report_type: selectedReportType,
              start_date: startOfDayString,
              end_date: endOfDayString,
            });
        
            console.log("📌 Debug: Report Data", res.data);
            setReports(res.data);
          } catch (error) {
            console.error("🔴 Error fetching reports:", error);
          } finally {
            setLoading(false);
          }
    };

      // ✅ รีเซ็ตค่าทั้งหมดเมื่อเปลี่ยนประเภทของรายงาน
      const handleReportTypeChange = (e) => {
        
        setSelectedReportType(e.target.value);
        setStartDate(firstDayOfMonth); // รีเซ็ตเป็นวันที่ 1 ของเดือนปัจจุบัน
        setEndDate(currentDate); // รีเซ็ตเป็นวันที่ปัจจุบัน
        setReports([]); // เคลียร์ข้อมูลรายงาน
    };

     


    return (
        <div className="container mt-4">
            <h1>📊 รายงาน</h1>
            <div className="card p-3 mb-3 shadow">
                <div className="row">
                    {isSuperAdmin && (
                        <div className="col-md-3">
                            <label className="form-label">เลือกสาขา</label>
                            <select className="form-select" value={selectedBranch || ""} onChange={handleBranchChange}>
                                <option value="">-- ทุกสาขา --</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="col-md-3">
                        <label className="form-label">ประเภทรายงาน</label>
                        <select className="form-select" value={selectedReportType || ""} onChange={handleReportTypeChange}>
                            <option value="">-- กรุณาเลือกประเภท --</option>
                            <option value="income">📈 รายรับ</option>
                            <option value="payout">📉 รายจ่าย</option>
                            <option value="profitloss">💰 กำไร-ขาดทุน</option>
                            <option value="topservices">🔥 บริการยอดนิยม</option>
                            <option value="customer">🛍️ รายงานลูกค้า</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">จากวันที่</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">ถึงวันที่</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={fetchReports} disabled={!selectedReportType}>
                            🔍 ค้นหา
                        </button>
                    </div>
                </div>
            </div>

            {/* ปุ่มดาวน์โหลด */}
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-success me-2" disabled={!reports.length}>📥 ดาวน์โหลด Excel</button>
                <button className="btn btn-danger" disabled={!reports.length}>📄 ดาวน์โหลด PDF</button>
            </div>

            {/* แสดงตารางรายงาน */}
            <div className="card p-3 shadow">
                {loading ? (
                    <div className="text-center py-3">⏳ กำลังโหลดข้อมูล...</div>
                ) : reports.length > 0 ? (
                    <ReportTable reportType={selectedReportType} reportBranch={selectedBranchName} reports={reports} />
                ) : (
                    <div className="text-center text-muted py-3">🔍 กรุณากดปุ่มค้นหาเพื่อดูรายงาน</div>
                )}
            </div>
        </div>
    );
};

export default ReportManagement;
