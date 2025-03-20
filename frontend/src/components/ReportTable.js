import React from "react";
const reportNames = {
        income: " รายรับ",
        payout: " รายจ่าย",
        profitloss: " กำไร-ขาดทุน",
        topservices: " บริการยอดนิยม",
        customer: " รายงานลูกค้า",
    };

const ReportTable = ({ reportType,reportBranch, reports }) => {
    const renderTableHeader = () => {
        switch (reportType) {
            case "income":
                return (
                    <tr className="text-center">
                        <th >วันที่ชำระเงิน</th>
                        <th>ชื่อลูกค้า</th>
                        <th>ยอดรวม</th>
                        <th>ส่วนลด</th>
                        <th>ชำระสุทธิ</th>
                    </tr>
                );
            case "payout":
                return (
                    <tr>
                        <th>วันที่จ่าย</th>
                        <th>ประเภทการจ่าย</th>
                        <th>รายละเอียด</th>
                        <th>จำนวนเงิน</th>
                        <th>หมายเหตุ</th>
                    </tr>
                );
            case "profitloss":
                return (
                    <tr>
                        <th>รายรับ (Income)</th>
                        <th>รายจ่าย (Payout)</th>
                        <th>กำไร / ขาดทุน</th>
                    </tr>
                );
            case "topservices":
                return (
                    <tr>
                        <th>อันดับ</th>
                        <th>ชื่อบริการ</th>
                        <th>จำนวนที่ใช้</th>
                        <th>รายได้รวม</th>
                    </tr>
                );
            case "customer":
                return (
                    <tr>
                        <th>อันดับ</th>
                        <th>เบอร์โทร</th>
                        <th>ชื่อที่ใช้บริการ</th>
                        <th>จำนวนครั้งที่ใช้บริการ</th>
                        <th>ยอดรวมที่ใช้</th>
                    </tr>
                );
            default:
                return (
                    <tr>
                        <th>วันที่</th>
                        <th>รายละเอียด</th>
                        <th>ประเภท</th>
                        <th>จำนวนเงิน</th>
                    </tr>
                );
        }
    };

    const renderTableRows = () => {        
        if (reports.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="text-center text-muted">ไม่มีข้อมูล</td>
                </tr>
            );
        }

        switch (reportType) {
            case "income":
                const totalIncome = reports.reduce((sum, report) => sum + parseFloat(report.total_amount || 0), 0);
                const totalDiscount = reports.reduce((sum, report) => sum + parseFloat(report.discount || 0), 0);
                const totalSum = totalIncome + totalDiscount;
            
                return (
                    <>
                        {reports.map((report, index) => {
                            const totalAmount = parseFloat(report.total_amount) || 0;
                            const discount = parseFloat(report.discount) || 0;
                            const totalSumRow = totalAmount + discount;
            
                            return (
                                <tr key={index}>
                                    <td>{new Date(report.payment_date).toLocaleDateString()}</td>
                                    <td>{report.customer_name}</td>
                                    <td className="text-end">{totalSumRow.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                    <td className="text-end">{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                    <td className="text-end">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                </tr>
                            );
                        })}
            
                        {/* ✅ แถวรวมยอดท้ายตาราง */}
                        {reports.length > 0 && (
                            <tr className="table-success fw-bold">
                                <td colSpan="2" className="text-end">รวมทั้งหมด:</td>
                                <td className="text-end">{totalSum.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                <td className="text-end">{totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                <td className="text-end">{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                
                            </tr>
                        )}
                    </>
                );
            
                case "payout":
                    const totalPayout = reports.reduce((sum, report) => sum + parseFloat(report.amount || 0), 0);                
                    return (
                        <>
                            {reports.map((report, index) => {
                                const amount = parseFloat(report.amount) || 0;
                                
                                return (
                                    <tr key={index}>
                                        <td>{new Date(report.payout_date).toLocaleDateString()}</td>
                                        <td>{report.payout_type}</td>
                                        <td>{report.description}</td>
                                        <td className="text-end">{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                        <td>{report.notes}</td>
                                    </tr>
                                );
                            })}
                
                            {/* ✅ แถวรวมยอดท้ายตาราง */}
                            {reports.length > 0 && (
                                <tr className="table-success fw-bold">
                                    <td colSpan="3" className="text-end">รวมทั้งหมด:</td>
                                    <td className="text-end">{totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                    <td></td>
                                </tr>
                            )}
                        </>
                    );
            case "profitloss":   
                return (
                    <>
                        {reports.map((report, index) => {
                            const total_income = parseFloat(report.total_income) || 0;
                            const total_payout = parseFloat(report.total_payout) || 0;
                            const net_profit = total_income - total_payout;
            
                            return (
                                <tr key={index}>
                                    <td className="text-end">{total_income.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                    <td className="text-end">{total_payout.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                    <td className={`text-end ${net_profit >= 0 ? "text-success" : "text-danger"}`}>
                                        {net_profit.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿
                                    </td>
                                </tr>
                            );
                        })}
                      
            
                     
                    </>
                );
                case "topservices":
                    const serviceIncome = reports.reduce((sum, report) => sum + parseFloat(report.total_revenue || 0), 0);
                    const serviceTimes = reports.reduce((sum, report) => sum + parseFloat(report.usage_count || 0), 0);
                    return (
                        <>
                            {reports.map((report, index) => (
                                <tr key={index}>
                                    <td>{report.rank}</td>
                                    <td>{report.service_name}</td>
                                    <td className="text-end">{report.usage_count.toLocaleString()} คู่</td>
                                    <td className="text-end">{parseFloat(report.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                </tr>
                            ))}
                            
                            {/* ✅ แถวรวมยอดท้ายตาราง */}
                            {reports.length > 0 && (
                                <tr className="table-success fw-bold">
                                    <td colSpan="2" className="text-end">รวมทั้งหมด:</td>
                                    <td className="text-end">{serviceTimes.toLocaleString()} คู่</td>
                                    <td className="text-end">{serviceIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                </tr>
                            )}
                        </>
                    );
                
                case "customer":
                    const totalSpent = reports.reduce((sum, report) => sum + parseFloat(report.total_spent || 0), 0);
                    const totalOrder = reports.reduce((sum, report) => sum + parseFloat(report.total_orders || 0), 0);
                    return (
                        <>
                            {reports.map((report, index) => (
                                <tr key={index}>
                                    
                                    <td>{report.rank}</td>
                                    <td>{report.phone}</td>
                                    <td>{report.customer_names}</td>
                                    <td className="text-end">{report.total_orders.toLocaleString()} ครั้ง</td>
                                    <td className="text-end">{parseFloat(report.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                </tr>
                            ))}
                            
                            {/* ✅ แถวรวมยอดท้ายตาราง */}
                            {reports.length > 0 && (
                                <tr className="table-success fw-bold">
                                    <td colSpan="3" className="text-end">รวมทั้งหมด:</td>
                                    <td className="text-end">{totalOrder.toLocaleString()} ครั้ง</td>
                                    <td className="text-end">{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</td>
                                </tr>
                            )}
                        </>
                    );
            default:
                return reports.map((report, index) => (
                    <tr key={index}>
                        <td>{new Date(report.date).toLocaleDateString()}</td>
                        <td>{report.description}</td>
                        <td>{report.type}</td>
                        <td>{report.amount.toFixed(2)} ฿</td>
                    </tr>
                ));
        }
    };

    return (
        <div className="card p-3 shadow">
            <h5>📋 รายงาน {reportNames[reportType] || "" } {reportBranch}</h5>
            <table className="table table-hover">
                <thead className="table-dark">
                    {renderTableHeader()}
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;
