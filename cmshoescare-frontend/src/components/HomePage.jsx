import React from 'react';
import { Phone, MapPin, Clock, Star, Package } from 'lucide-react';

const HomePage = ({ setCurrentPage }) => {
  const services = [
    { name: 'Canvas Cleaning', price: '฿150-200', description: 'ทำความสะอาดรองเท้าผ้าใบลึกถึงใยผ้า' },
    { name: 'Leather Care', price: '฿200-300', description: 'ดูแลหนังอย่างมืออาชีพ' },
    { name: 'Waterproofing', price: '฿100-150', description: 'เคลือบกันน้ำยืดอายุรองเท้า' },
    { name: 'Sole Whitening', price: '฿250-350', description: 'ฟื้นฟูพื้นรองเท้าให้ขาวเหมือนใหม่' },
    { name: 'Shoe Spa Package', price: '฿400-500', description: 'ดูแลครบจบในแพ็คเกจเดียว' },
  ];

  const reviews = [
    { name: 'คุณสมใจ', rating: 5, text: 'รองเท้าสะอาดเหมือนใหม่ ประทับใจมากค่ะ' },
    { name: 'คุณนิดา', rating: 5, text: 'บริการดี ส่งถึงบ้านตรงเวลา' },
    { name: 'คุณปิติ', rating: 5, text: 'ราคาคุ้ม คุณภาพเยี่ยม' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Package className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">ร้านซักเกิบแอนด์สปา</h1>
          </div>
          <button
            onClick={() => setCurrentPage('appointment')}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            จองคิว
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-tr from-blue-700 to-indigo-800 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">บริการซักรองเท้าพรีเมียม</h2>
          <p className="text-lg opacity-90 mb-4">ดูแลรองเท้าคู่โปรดของคุณ อย่างมืออาชีพ</p>
          <p className="opacity-80 mb-8">📍 เชียงใหม่ | เปิดให้บริการตั้งแต่ปี 2019</p>
          <button
            onClick={() => setCurrentPage('appointment')}
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            จองคิวออนไลน์
          </button>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">บริการของเรา</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{s.name}</h4>
                <p className="text-blue-600 font-bold text-lg mb-2">{s.price}</p>
                <p className="text-gray-600 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">เสียงจากลูกค้า</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-xl shadow-md p-6">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{r.text}"</p>
                <p className="font-semibold text-gray-900">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-12">ติดต่อเรา</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Phone className="mx-auto mb-2" />
              <p>โทร: 053-123-456</p>
            </div>
            <div>
              <MapPin className="mx-auto mb-2" />
              <p>เชียงใหม่ ประเทศไทย</p>
            </div>
            <div>
              <Clock className="mx-auto mb-2" />
              <p>ทุกวัน 9:00 - 18:00</p>
            </div>
          </div>
          <button className="mt-8 bg-green-500 px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition">
            เพิ่มเพื่อน LINE OA
          </button>
        </div>
      </section>

      {/* Floating call button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition">
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
