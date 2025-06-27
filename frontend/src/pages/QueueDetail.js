import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkSession } from "../services/authService";
import { getQueueDetail, getAllServices, addQueueItems, deleteQueueItem, uploadAfterImages, updateQueue, updateQueueStatus, deleteQueue,generateInvoice } from '../services/api';
import { getExpenses, createExpense, deleteExpense, createPayment, cancelPayment } from "../services/api"; 
import './QueueDetail.css';
import '../assets/css/bootstrap.min.css';
import AddShoeModal from "../components/AddShoeModal"; 
import ShoeDetailModal from "../components/ShoeDetailModal"; 
import AddExpenseModal from "../components/AddExpenseModal";
import UpdateQueueStatusModal from "../components/UpdateQueueStatusModal";
import PaymentModal from "../components/PaymentModal";
import { printReceipt } from "../components/printReceipt"; // ✅ Import ฟังก์ชันพิมพ์สลิป
import EditQueueModal from "../components/EditQueueModal";
import InvoiceModal from '../components/InvoiceModal';
import CameraCaptureModal from "../components/CameraCaptureModal";
import { FaEye,FaPlus } from 'react-icons/fa';




const QueueDetail = () => {
    const navigate = useNavigate();
    const { queue_id } = useParams();
    const [queue, setQueue] = useState(null);
    const [services, setServices] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

    const Backend_URL = 'http://localhost:5000';

    const [showAddShoeModal, setShowAddShoeModal] = useState(false);
    const [showShoeDetailModal, setShowShoeDetailModal] = useState(false);
    const [selectedShoe, setSelectedShoe] = useState(null);

    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

    const [showUpdateQueueStatusModal, setShowUpdateQueueStatusModal] = useState(false);
    const [selectedQueueId, setSelectedQueueId] = useState(null);
    const [currentStatus, setCurrentStatus] = useState("");


    const totalPairs = queue?.queue_items?.length || 0;
    const totalPrice = queue?.queue_items?.reduce((sum, item) => sum + parseFloat(item.price_per_pair), 0 || 0.00);

    const [afterImages, setAfterImages] = useState({
        front: null,
        back: null,
        left: null,
        right: null,
        top: null,
        bottom: null
    });

    const [showUploadAfterModal, setShowUploadAfterModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingQueue, setEditingQueue] = useState(null);

    const [currentAfterPosition, setCurrentAfterPosition] = useState(null);


    const [invoiceUrl, setInvoiceUrl] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    
    const sourceColors = {
        manual:   '#6C757D',  // เทา Bootstrap = เจ้าหน้าที่กรอกเอง (ไม่มีแอป)
        locker:   '#FFB74D',  // ส้มพาสเทล = Locker (สีแทนเองแบบอบอุ่นและแตกต่าง)
        line:     '#06C755',  // เขียว LINE Official (จาก LINE Brand Guidelines)
        facebook: '#1877F2',  // น้ำเงิน Facebook
        wechat:   '#7BB32E',  // เขียว WeChat จริง (จาก Tencent branding)
        unknown:  '#B0BEC5'   // เทาพาสเทล = ไม่ระบุ
    };

    const sourceLabels = {
        manual: 'พนักงาน',
        locker: 'Locker',
        line: 'LINE',
        facebook: 'Facebook',
        wechat: 'WeChat',
        unknown: 'ไม่ระบุ'
    };
    useEffect(() => {
    const init = async () => {
        const user = await checkSession();
        if (!user) {
        setTimeout(() => navigate("/login"), 0);
        return;
        }

        if (queue_id) {
        fetchQueueDetail();
        fetchServices();
        fetchExpenses();
        }
    };

    init();
    }, [navigate, queue_id]);


    const fetchQueueDetail = async () => {
        try {
            const res = await getQueueDetail(queue_id);
            //console.log("📌 Debug: ข้อมูลจาก API", res.data); // ✅ ตรวจสอบข้อมูลที่มาจาก API
            setQueue(res.data);
        } catch (error) {
            console.error("🔴 Error fetching queue detail:", error);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await getAllServices();            
            setServices(res.data);
        } catch (error) {
            console.error("🔴 Error fetching services:", error.response?.data || error.message);
        }
    };
    
    const fetchExpenses = async () => {
        try {
            const res = await getExpenses(queue_id);
            setExpenses(res.data);
        } catch (error) {
            console.error("🔴 Error fetching expenses:", error);
        }
    };

    const handleAddExpense = async (expense) => { 
        if (!expense.description.trim() || isNaN(expense.amount) || parseFloat(expense.amount) <= 0) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วนและจำนวนเงินต้องมากกว่า 0");
            return;
        }
        try {
            // ✅ ส่งข้อมูลเป็น JSON
            await createExpense({
                queue_id,
                description: expense.description.trim(),
                amount: parseFloat(expense.amount),
            });
    
            alert("✅ เพิ่มค่าใช้จ่ายเรียบร้อย!");

            await fetchQueueDetail();
            await fetchExpenses();

            setShowAddExpenseModal(false);
        } catch (error) {
            console.error("🔴 Error adding expense:", error);
            alert("❌ ไม่สามารถเพิ่มค่าใช้จ่ายได้");
        }
    };
    

    const handleDeleteExpense = async (expense_id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) return;
        try {
            await deleteExpense(queue_id,expense_id);
            alert("✅ ลบค่าใช้จ่ายเรียบร้อย!");
            
            await fetchQueueDetail();
            await fetchExpenses();

        } catch (error) {
            console.error("🔴 Error deleting expense:", error);
            alert("❌ ไม่สามารถลบค่าใช้จ่ายได้");
        }
    };

    const getTotalExpenses = () => expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);


    const handleRemoveShoe = async (queue_item_id) => {
       
        if (!queue_item_id) {
            console.error("❌ ไม่พบ item_id");
            return;
        }

        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรองเท้านี้?")) return;
        try {
    
            await deleteQueueItem(queue_id, queue_item_id);
            alert("✅ ลบรองเท้าเรียบร้อย!");
            fetchQueueDetail();
        } catch (error) {
            console.error("🔴 Error deleting shoe:", error);
        }
    };

    const openUploadAfterModal = (queue_item_id) => {
        setSelectedItemId(queue_item_id);
        setShowUploadAfterModal(true);
    };

    const closeUploadAfterModal = () => {
        setShowUploadAfterModal(false);
        setAfterImages({ front: null, back: null, left: null, right: null, top: null, bottom: null });
    };

    const handleAfterImageUpload = (position, file) => {
        if (file) {
            setAfterImages(prev => ({ ...prev, [position]: file }));
        }
    };
        
    const handleUploadAfterImages = async () => {
        if (!selectedItemId) {
            alert("❌ ไม่พบ Item ID");
            return;
        }

        const positions = Object.keys(afterImages).filter(pos => afterImages[pos] instanceof File);
        if (positions.length === 0) {
            alert("❌ กรุณาเลือกรูป AFTER อย่างน้อย 1 มุมก่อนอัปโหลด");
            return;
        }

        const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการอัปโหลดรูป AFTER?");
        if (!confirm) return;

        const formData = new FormData();
        for (const pos of positions) {
            formData.append(`image_after_${pos}`, afterImages[pos]);
        }

        try {
            await uploadAfterImages(queue_id, selectedItemId, formData);
            alert("✅ อัปโหลดรูป AFTER สำเร็จ!");
            await fetchQueueDetail(); // รีโหลดข้อมูล
            closeUploadAfterModal();  // ปิด modal และเคลียร์ state
            setAfterImages({ front: null, back: null, left: null, right: null, top: null, bottom: null }); // reset
        } catch (error) {
            console.error("🔴 Error uploading after images:", error);
            alert("❌ เกิดข้อผิดพลาดในการอัปโหลด!");
        }
    };

    const handleAddShoe = async (selectedService, shoeData) => {
    
        if (!selectedService || !shoeData.brand || !shoeData.model || !shoeData.color) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        const selectedServiceData = services.find(service => service.id === parseInt(selectedService));
        const price_per_pair = selectedServiceData ? selectedServiceData.base_price : 0;
    
        // ✅ แปลง `shoeData` เป็น `FormData`
        const formData = new FormData();
        formData.append("queue_id", queue_id);
        formData.append("service_id", selectedService);
        formData.append("brand", shoeData.brand);
        formData.append("model", shoeData.model);
        formData.append("color", shoeData.color);
        formData.append("notes", shoeData.notes || "");
        formData.append("price_per_pair", price_per_pair);
    
        // ✅ เพิ่มไฟล์รูปเข้า `FormData`
        Object.keys(shoeData.images).forEach((key) => {
            if (shoeData.images[key]) {
                formData.append(key, shoeData.images[key]); 
            }
        });
        
        try {

            const res = await addQueueItems(queue_id, formData);

            alert("✅ เพิ่มรองเท้าเรียบร้อย!");
            fetchQueueDetail();
        setShowAddShoeModal(false); // ✅ ปิด Modal ทันที
        } catch (error) {
            console.error("🔴 Error adding shoe:", error);
            alert("❌ มีข้อผิดพลาดในการเพิ่มรองเท้า");
        }
    };

     // ✅ ฟังก์ชันแสดง Modal รายละเอียดรองเท้า
     const handleShowShoeDetail = (shoe) => {
        setSelectedShoe(shoe);
        setShowShoeDetailModal(true);
    };
      

    const getServiceSummary = () => {
        const serviceMap = {};
    
        // ✅ รวมค่าบริการซักรองเท้า
        if (queue && queue.queue_items && queue.queue_items.length > 0) {
            queue.queue_items.forEach(item => {
                if (!serviceMap[item.service_id]) {
                    serviceMap[item.service_id] = {
                        service_name: item.service_name || "ไม่ระบุ", 
                        total_pairs: 0,
                        total_price: 0
                    };
                }
    
                serviceMap[item.service_id].total_pairs += 1;
    
                const price = parseFloat(item.price_per_pair);
                serviceMap[item.service_id].total_price += !isNaN(price) ? price : 0;
            });
        }
    
        // ✅ รวมค่าใช้จ่ายเพิ่มเติม (expenses)
        if (expenses && expenses.length > 0) {
            expenses.forEach(exp => {
                const expenseKey = `expense_${exp.id}`;
    
                serviceMap[expenseKey] = {
                    service_name: exp.description,  // ✅ ใช้ description เป็นชื่อบริการ
                    total_pairs: 1,                 // ✅ กำหนดให้ค่าใช้จ่ายเป็น 1 รายการตายตัว
                    total_price: parseFloat(exp.amount) || 0 // ✅ ใช้ amount เป็นราคาของรายการ
                };
            });
        }
    
        return Object.values(serviceMap);
    };

    const handleOpenPaymentModal = () => {
        if(queue.payment_status == "ชำระเงินแล้ว"){
            alert("ไม่สามารถชำระเงินซ้ำได้!");
            return;
        }
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async (discount, totalAmount, paymentMethod) => {
    const message = "เมื่อคุณชำระเงินแล้ว จะไม่สามารถแก้ไขข้อมูลใดๆ ได้อีก\nยืนยันการชำระเงินหรือไม่?";
    
    if (!window.confirm(message)) return;

    try {
        const paymentRes = await createPayment({
            queue_id,
            discount,
            total_amount: totalAmount,
            payment_method: paymentMethod,
        });

        const payment_id = paymentRes.data.payment_id || "N/A";

        alert("✅ ชำระเงินเรียบร้อย!");
        setShowPaymentModal(false);

        await fetchQueueDetail(); // ✅ รีเฟรชข้อมูลคิว
        navigate("/queue"); // ✅ กลับไปหน้าคิว

        // ✅ ถามว่าต้องการพิมพ์สลิปหรือไม่
        const confirmPrint = window.confirm("🖨 ต้องการพิมพ์สลิปหรือไม่?");
        if (confirmPrint) {
            printReceipt(payment_id,queue, getServiceSummary(), discount, totalAmount, paymentMethod);
        }
        
    } catch (error) {
        console.error("🔴 Error processing payment:", error);
        alert("❌ ไม่สามารถชำระเงินได้");
    }
};

    
    const handleUpdateQueueStatus = async (queueId, newStatus, totalPrice, deliveryData = {}) => {
        try {
            const deliveryMethod = deliveryData.deliveryMethod || null;

            // ✅ ส่ง deliveryMethod เข้าไปในการอัปเดต
            await updateQueueStatus(queueId, newStatus, totalPrice, deliveryMethod);

            alert("✅ อัปเดตสถานะคิวเรียบร้อย!");
            fetchQueueDetail(); // โหลดข้อมูลใหม่
        } catch (error) {
            console.error("🔴 Error updating queue status:", error);
            alert("❌ ไม่สามารถอัปเดตสถานะคิวได้");
        }
    };

    const handleOpenUpdateStatusModal = (queueId, status) => {
        setSelectedQueueId(queueId);
        setCurrentStatus(status);
        setShowUpdateQueueStatusModal(true);
    };

    const handleDeleteQueue = async (queueId) => {
            if(queue.status == "จัดส่งสำเร็จ"){
                alert("🔴 ไม่สามารถลบคิวที่จัดส่งสำเร็จ!");
                return;
            }
     
            if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคิวนี้?")) {
                try {
                    await deleteQueue(queueId);
                    alert("✅ คิวถูกลบเรียบร้อย!"); // ✅ แจ้งเตือนหลังลบสำเร็จ
                    navigate('/queue'); // ✅ Redirect ไปที่หน้า QueueAdmin
                } catch (error) {
                    console.error("🔴 Error deleting queue:", error);
                }
            }
        };
    
    const getStatusTextClass = (status) => {
        switch (status) {
            case "รับเข้า":
                return "text-secondary"; // สีเทา
            case "อยู่ระหว่างทำความสะอาด":
                return "text-warning"; // สีเหลือง
            case "เตรียมส่ง":
                return "text-info"; // สีฟ้า
            case "กำลังจัดส่ง":
                return "text-primary"; // สีน้ำเงิน
            case "จัดส่งสำเร็จ":
                return "text-success"; // สีเขียว  
            case "pending":
            return "text-danger"; // สีเขียว   
            case "ชำระเงินแล้ว":
            return "text-success"; // สีเขียว               
            default:
                return "text-dark"; // สีดำ กรณีไม่มีสถานะ
        }
    };
    
    const totalServicePrice = queue?.queue_items?.reduce((sum, item) => sum + parseFloat(item.price_per_pair || 0), 0);
    const totalExpense = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const totalQueuePrice = (totalServicePrice + totalExpense).toFixed(2); // รวมค่าบริการและค่าใช้จ่ายเพิ่มเติม

    //เมื่่อชำระเงินแล้ว ไม่สามารถแก้ไขข้อมูลได้อีก
    const isPaid = queue?.payment_status === "ชำระเงินแล้ว";
    // ✅ ตรวจสอบว่ายอดรวมเป็น 0 หรือไม่
    const isTotalZero = parseFloat(totalQueuePrice) <= 0; 

    // ✅ กำหนดฟังก์ชันยกเลิกการชำระเงิน
    const handleCancelPayment = async () => {
        if (!window.confirm("❗ คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการชำระเงิน?")) return;
    
        try {
            await cancelPayment(queue_id); // ✅ เรียก API ลบข้อมูลการชำระเงิน
            alert("✅ ยกเลิกการชำระเงินเรียบร้อย!");
    
            await fetchQueueDetail(); // ✅ โหลดข้อมูลใหม่
        } catch (error) {
            console.error("🔴 Error cancelling payment:", error);
            alert("❌ ไม่สามารถยกเลิกการชำระเงินได้");
        }
    };

    const handleEdit = (queueId) => {
        setSelectedQueueId(queueId);
        setShowEditModal(true);
    };

    
    const handleUpdateQueue = async (updatedData) => {
        // 👉 call API updateQueue here
        const id = updatedData.queue_id;
        try{
            await updateQueue(id, updatedData);
            alert("✅ แก้ไขข้อมูลคิวเรียบร้อย!");
            fetchQueueDetail(); // โหลดข้อมูลใหม่
        }
        catch(error){
            console.error("🔴 Error updating queue:", error);
            alert("❌ ไม่สามารถอัปเดตข้อมูลคิวได้");
        }
        // จากนั้นค่อยปิด modal
        setShowEditModal(false);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);  
    };

    const handleGenerateInvoice = async (queue_id) => {
        try {
            const res = await generateInvoice(queue_id); // เรียก API
            setInvoiceUrl(res.data.image_base64); // ✅ ใช้รูปแบบ Base64
            console.log("📄 Base64:", res.data.image_base64);
            setShowInvoiceModal(true); // ✅ เปิด Modal
        } catch (error) {
            console.error("🔴 Error generating invoice:", error);
            alert("❌ ไม่สามารถสร้างใบแจ้งราคาได้");
        }
    };
    


    const buttonStyle = {
        minWidth: "120px",
        fontSize: "16px",
        padding: "10px 16px",
        borderRadius: "12px",
        textAlign: "center",
        };

    if (!queue) return <p>⏳ กำลังโหลดข้อมูล...</p>;

    return (
        <div className="queue-container">
            <div className="d-flex justify-content-between align-items-center"> {/* ✅ Container for date/time and title */}
             <div>
                <br/>
                <h2> รายละเอียด</h2>
             </div>
          </div>
          <div className="section-card position-relative">
            <div className="position-relative">
                {/* ✅ ปุ่มลอยมุมขวาบน */}
                <div
                className="position-absolute top-0 end-0 d-flex gap-2 flex-wrap"
                style={{ transform: "translateY(-20px)" }}
                >
                <button className="btn btn-primary uniform-button" style={buttonStyle} onClick={() => handleEdit(queue_id)}>
                    ✏️ แก้ไข
                </button>
                {isPaid ? (
                    <button className="btn btn-danger uniform-button" style={buttonStyle} onClick={handleCancelPayment}>
                    ⛔ ยกเลิกชำระเงิน
                    </button>
                ) : (
                    <button className="btn btn-success uniform-button" style={buttonStyle} onClick={handleOpenPaymentModal} disabled={isTotalZero}>
                    💰 ชำระเงิน
                    </button>
                )}
                <button className="btn btn-warning uniform-button" style={buttonStyle} onClick={() => handleOpenUpdateStatusModal(queue.queue_id, queue.status)}>
                    อัปเดตสถานะ
                </button>
                <button className="btn btn-success uniform-button" style={buttonStyle} onClick={() =>handleGenerateInvoice(queue_id)}>
                     ใบแจ้งราคา                      
                </button>
                <button className="btn btn-danger uniform-button" style={buttonStyle} onClick={() => handleDeleteQueue(queue_id)} disabled={isPaid}>
                    ลบคิว
                </button>
                </div>

                {/* ✅ สถานะ ลอยใต้ปุ่ม */}
                <div
                className="position-absolute end-0"
                style={{
                    top: "40px", // ปรับตามความสูงของปุ่ม
                    background: "#f8f9fa",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 1,
                }}
                >
                <div className="d-flex gap-5 flex-wrap align-items-center">
                    <span className="fw-bold text-dark">
                    📦 สถานะงาน:
                    <span className={getStatusTextClass(queue.status)} style={{ marginLeft: "6px" }}>
                        {queue.status}
                    </span>
                    </span>

                    <span className="fw-bold text-dark">
                    💳 ชำระเงิน:
                    <span className={getStatusTextClass(queue.payment_status)} style={{ marginLeft: "6px" }}>
                        {queue.payment_status}
                    </span>
                    </span>
                </div>
                </div>

                {/* ✅ หัวคิว */}
                <h5 className="mb-3">🏷️ คิวงาน #{queue_id} - สาขา {queue.branch_name}</h5>
            </div>

            <div className="row mb-2">
            <div className="col-md-5">
                <strong>ช่องทาง:</strong>{" "}
                <span
                style={{
                    backgroundColor: sourceColors[queue.source] || "#eee",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                }}
                >
                {sourceLabels[queue.source] || "ไม่ระบุ"}
                </span>
            </div>

            {queue.source === "locker" && (
                <div className="col-md-6">
                <strong>ตู้:</strong>{" "}
                <span className="text-muted">
                    {queue.locker_code} - {queue.locker_name}
                </span>{" "}
                </div>
            )}
            </div>

            {/* ✅ ข้อมูลลูกค้า */}
            <div className="row mb-2">
                <div className="col-md-5">
                <strong>ลูกค้า : </strong> {queue.customer_name}
                </div>
                <div className="col-md-6">
                <strong>เบอร์โทร : </strong> {queue.phone}
                </div>
            </div>
            
            <div className="row mb-2">
                <div className="col-md-5">
                <strong>สถานที่ : </strong> {queue.location}
                </div>
                <div className="col-md-6">
                <strong>จำนวนคู่ : </strong> {queue.total_pairs}
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-md-5">
                <strong>วันที่รับ : </strong> {new Date(queue.received_date).toLocaleDateString()}
                </div>
                <div className="col-md-6">
                <strong>กำหนดส่ง : </strong> {new Date(queue.delivery_date).toLocaleDateString()}
                </div>
            </div>
            </div>



            <div className="section-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>👟 รายการรองเท้า</h4>
                        <button
                            className="btn btn-primary" onClick={() => {setShowAddShoeModal(true);}}
                            disabled={isPaid}
                            >
                            <FaPlus style={{ marginRight: "6px" }} />
                            เพิ่มรองเท้า
                        </button>
            </div>

           <table className="table table-hover table-striped">
            <thead>
                <tr>
                <th>แบรนด์</th>
                <th>รุ่น</th>
                <th>สี</th>
                <th>รูป BEFORE</th>
                <th>รูป AFTER</th>
                <th>ค่าบริการ</th>
                <th>ลบ</th>
                </tr>
            </thead>
            <tbody>
                {queue.queue_items.length === 0 ? (
                <tr>
                    <td colSpan="7" className="text-center text-muted py-3">
                    📭 ยังไม่มีรายการรองเท้าในคิวนี้
                    </td>
                </tr>
                ) : (
                queue.queue_items.map((item, index) => (
                    <tr key={index} onClick={() => handleShowShoeDetail(item)}>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>
                    <td>{item.color}</td>

                    {/* ✅ BEFORE Images */}
                    <td>
                        <div className="shoe-images">
                        {["front"].map((pos) =>
                            item[`image_before_${pos}`] ? (
                            <img
                                key={pos}
                                src={`${Backend_URL}${item[`image_before_${pos}`]}`}
                                alt={`before-${pos}`}
                                width="50"
                            />
                            ) : null
                        )}
                        </div>
                    </td>

                    {/* ✅ AFTER Images */}
                    <td>
                        <div className="shoe-images">
                        {["front"].map((pos) =>
                            item[`image_after_${pos}`] ? (
                            <img
                                key={pos}
                                src={`${Backend_URL}${item[`image_after_${pos}`]}`}
                                alt={`after-${pos}`}
                                width="50"
                            />
                            ) : null
                        )}
                        </div>
                    </td>

                    <td>{item.price_per_pair}</td>

                    {/* ✅ ปุ่มลบ */}
                    <td>
                        <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveShoe(item.queue_item_id);
                        }}
                        disabled={isPaid}
                        >
                        ❌ ลบ
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>

            
            <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                <h4>💰 ค่าใช้จ่ายเพิ่มเติม</h4>
                <button
                    className="btn btn-primary" onClick={() => setShowAddExpenseModal(true)} disabled={isPaid}>
                    <FaPlus style={{ marginRight: "6px" }} />
                    เพิ่มค่าใช้จ่าย
                </button>
            </div>
           
            {/* ตารางค่าใช้จ่ายเพิ่มเติม */}
            <table className="table table-hover table-striped">
                <thead>
                    <tr>
                    <th>รายละเอียด</th>
                    <th>จำนวนเงิน (บาท)</th>
                    <th>ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="text-center text-muted py-3">
                        📭 ยังไม่มีรายการค่าใช้จ่ายเพิ่มเติม
                        </td>
                    </tr>
                    ) : (
                    expenses.map((expense, index) => (
                        <tr key={index}>
                        <td>{expense.description}</td>
                        <td>{expense.amount}</td>
                        <td>
                            <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            disabled={isPaid}
                            >
                            ❌ ลบ
                            </button>
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>

              </div>       
            <div className="card p-3 shadow mt-4">

                {/* ✅ ตารางสรุปบริการที่ใช้ */}
                <h4>📋 สรุปบริการที่ใช้</h4>
                <table className="table table-hover table-striped">
  <thead>
    <tr>
      <th>บริการ</th>
      <th>จำนวน</th>
      <th>ราคารวม (บาท)</th>
    </tr>
  </thead>
  <tbody>
    {getServiceSummary().length === 0 ? (
      <tr>
        <td colSpan="3" className="text-center text-muted py-3">
          📭 ยังไม่มีบริการในคิวนี้
        </td>
      </tr>
    ) : (
      <>
        {getServiceSummary().map((service, index) => (
          <tr key={index}>
            <td>{service.service_name}</td>
            <td>{service.total_pairs}</td>
            <td>{service.total_price ? service.total_price.toFixed(2) : "0.00"}</td>
          </tr>
        ))}

        {/* ✅ บรรทัดรวมยอดท้ายตาราง */}
        <tr className="total-row">
          <td><strong>รวมทั้งหมด</strong></td>
          <td><strong>{getServiceSummary().reduce((sum, s) => sum + s.total_pairs, 0)}</strong></td>
          <td><strong>{getServiceSummary().reduce((sum, s) => sum + s.total_price, 0).toFixed(2)}</strong></td>
        </tr>
      </>
    )}
  </tbody>
</table>


            </div>
                    
        {showUploadAfterModal && (
            <div className="upload-modal-overlay d-flex align-items-center justify-content-center">
                <div className="upload-modal-content card p-4 shadow-lg" style={{ width: '90%', maxWidth: '800px' }}>
                    <h3 className="text-center mb-4">📷 อัปโหลดรูป AFTER</h3>

                    <div className="row g-4">
                        {["front", "back", "left", "right", "top", "bottom"].map((pos, index) => (
                            <div key={index} className="col-6 col-md-4 text-center">
                                <label className="form-label fw-bold">{`📷 ด้าน ${pos.toUpperCase()}`}</label>
                                <div className="mb-2">
                                    <button className="btn btn-outline-primary w-100" onClick={() => setCurrentAfterPosition(pos)}>
                                        ถ่ายรูป
                                    </button>
                                </div>
                                {afterImages[pos] && (
                                    <img
                                        src={URL.createObjectURL(afterImages[pos])}
                                        alt={`after-${pos}`}
                                        className="img-thumbnail"
                                        style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end mt-4 gap-2">
                        <button className="btn btn-danger" onClick={closeUploadAfterModal}>❌ ปิด</button>
                        <button className="btn btn-success" onClick={handleUploadAfterImages}>✅ อัปโหลด</button>
                    </div>
                </div>

                {/* Modal ถ่ายรูป */}
                <CameraCaptureModal
                    show={!!currentAfterPosition}
                    onClose={() => setCurrentAfterPosition(null)}
                    onCapture={(file) => {
                        setAfterImages(prev => ({ ...prev, [currentAfterPosition]: file }));
                        setCurrentAfterPosition(null);
                    }}
                />
            </div>
        )}


        <div className="container queue-detail-container">
            <PaymentModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirm={handleConfirmPayment}
                serviceSummary={getServiceSummary()}
                totalPrice={parseFloat((queue?.total_price || 0) + getTotalExpenses()) || 0} // ✅ แปลงให้เป็นตัวเลขแน่นอน
            />

            <UpdateQueueStatusModal
                show={showUpdateQueueStatusModal}
                handleClose={() => setShowUpdateQueueStatusModal(false)}
                handleUpdate={handleUpdateQueueStatus}
                queueId={queue_id}
                currentStatus={queue?.status}
                totalPrice={totalQueuePrice}
                queue={queue}
            />

            {showAddShoeModal && (
                <AddShoeModal 
                    show={showAddShoeModal} 
                    onClose={() => {
                        setShowAddShoeModal(false);
                    }} 
                    onAddShoe={(selectedService, shoeData) => {
                        handleAddShoe(selectedService, shoeData); // ✅ เรียก API ที่เพิ่มรองเท้า
                    }} 
                    services={services} 
                />
            )}
        
            {showShoeDetailModal && (
                <ShoeDetailModal 
                show={showShoeDetailModal} 
                onClose={() => setShowShoeDetailModal(false)} 
                shoe={selectedShoe} 
                queue_id={queue_id} // ✅ ส่ง queue_id ไป
                fetchQueueDetail={fetchQueueDetail} 
                uploadAfterImages={uploadAfterImages} 
            />        
                    )}
       
            

            {/* Modal เพิ่มค่าใช้จ่าย */}
            <AddExpenseModal
                show={showAddExpenseModal}
                onClose={() => setShowAddExpenseModal(false)}
                onAddExpense={handleAddExpense} // ✅ ตรวจสอบว่าใช้ฟังก์ชันที่แก้ไขแล้ว
            />

             {/* Modal แก้ไขข้อมูลคิว */}           
            <EditQueueModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                queueId={selectedQueueId}
                onSave={handleUpdateQueue}
            />

            {/* Modal ใบแจ้งราคา */}    
            <InvoiceModal
                show={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
                imageBase64={invoiceUrl}
                />

            </div>
        </div>
    );
};

export default QueueDetail;
