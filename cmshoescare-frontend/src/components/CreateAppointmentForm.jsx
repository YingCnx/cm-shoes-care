import React, { useState } from 'react';

const CreateAppointmentForm = ({ setCurrentPage }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    time: '',
    quantity: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('ส่งคำจองคิวสำเร็จแล้ว!');
    setCurrentPage('home');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">จองคิวทำความสะอาดรองเท้า</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="ชื่อ" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input name="phone" placeholder="เบอร์โทร" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input name="location" placeholder="สถานที่รับ-ส่ง" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input name="time" placeholder="เวลานัดหมาย (เช่น 14:00)" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input name="quantity" placeholder="จำนวนคู่รองเท้า" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <div className="flex justify-between">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">ส่งคำจอง</button>
          <button type="button" onClick={() => setCurrentPage('home')} className="text-gray-600 underline">ย้อนกลับ</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointmentForm;
