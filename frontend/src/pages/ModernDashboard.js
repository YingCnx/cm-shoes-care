import React, { useState, useEffect } from 'react';
import { 
  FaMoneyBill, 
  FaMoneyCheckAlt, 
  FaListUl, 
  FaCalendarAlt, 
  FaClipboardList,
  FaBell,
  FaSearch,
  FaUser,
  FaCog,
  FaChevronDown,
  FaHome,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaDatabase,
  FaLock,
  FaSignOutAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';

const ModernDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState('');
  
  // Mock data - replace with your actual data
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 19740,
    monthlyExpenses: 699,
    pendingQueues: 14,
    totalPairs: 29,
    dailyIncome: 0,
    pendingAppointments: 8
  });

  const [queueData] = useState([
    { id: 1, customer: 'Sarinya Utsp', location: 'Walk-in', pairs: 1, received: '25/5/2568', delivery: '30/5/2568', status: 'กำลังจัดส่ง', overdue: true },
    { id: 2, customer: 'Line→Achiraya←', location: 'Walk-in', pairs: 3, received: '27/5/2568', delivery: '3/6/2568', status: 'กำลังจัดส่ง', overdue: true },
    { id: 3, customer: 'Line-ศิกรินทร์วาทวิชย์', location: '117/358 กาจรสุ', pairs: 3, received: '30/5/2568', delivery: '3/6/2568', status: 'กำลังจัดส่ง', overdue: true },
    { id: 4, customer: 'Korakoch Sonthi', location: 'ส่ง Grab มา', pairs: 2, received: '2/6/2568', delivery: '5/6/2568', status: 'กำลังจัดส่ง', overdue: false },
    { id: 5, customer: 'Korn Wika', location: 'grab', pairs: 3, received: '1/6/2568', delivery: '8/6/2568', status: 'กำลังจัดส่ง', overdue: false }
  ]);

  const [appointments] = useState([
    { id: 1, customer: 'Pawlat Promchat', phone: '089-xxx-xxxx', location: 'Walk-in', date: '2568-06-11', time: '14:30', status: 'ยืนยันแล้ว' },
    { id: 2, customer: 'Siriporn Nakwan', phone: '081-xxx-xxxx', location: 'Home Service', date: '2568-06-11', time: '16:00', status: 'รอดำเนินการ' }
  ]);

  const branches = [
    { id: 1, name: 'สาขาเชียงใหม่' },
    { id: 2, name: 'สาขากรุงเทพ' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const statusColors = {
    'รับเข้า': 'bg-blue-100 text-blue-800',
    'อยู่ระหว่างทำความสะอาด': 'bg-yellow-100 text-yellow-800',
    'เตรียมส่ง': 'bg-purple-100 text-purple-800',
    'กำลังจัดส่ง': 'bg-orange-100 text-orange-800',
    'สำเร็จ': 'bg-green-100 text-green-800',
    'ยืนยันแล้ว': 'bg-green-100 text-green-800',
    'รอดำเนินการ': 'bg-red-100 text-red-800'
  };

  const sidebarItems = [
    { icon: FaHome, label: 'หน้าหลัก', active: true },
    { icon: FaListUl, label: 'จัดการคิวงาน' },
    { icon: FaCalendarAlt, label: 'จัดการนัดหมาย' },
    { icon: FaUsers, label: 'ลูกค้า' },
    { icon: FaChartBar, label: 'รายงาน' },
    { icon: FaLock, label: 'SMART LOCKER' },
    { icon: FaCog, label: 'ตั้งค่า' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CM</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold">CM SHOES CARE</h1>
                <p className="text-xs text-slate-300">ระบบจัดการร้านซักรีดรองเท้า</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <FaUser className="text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium">ying@chiangmai.com</p>
                <p className="text-xs text-slate-300">Employee - Chiangmai</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-6">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors ${
                item.active ? 'bg-slate-700 text-white border-r-2 border-cyan-400' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors">
            <FaSignOutAlt className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3">ออกจากระบบ</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-gray-100"
        >
          <FaChevronDown className={`w-3 h-3 transition-transform ${sidebarCollapsed ? 'rotate-90' : '-rotate-90'}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
              <p className="text-gray-600 text-sm mt-1">
                {currentTime.toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} - {currentTime.toLocaleTimeString('th-TH')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Branch Selector */}
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">เลือกสาขา</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหา"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <FaBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>

              {/* Backup Button */}
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <FaDatabase className="w-4 h-4 inline mr-2" />
                Backup Database
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">รายรับเดือนนี้</p>
                  <p className="text-3xl font-bold text-green-700">{dashboardData.monthlyIncome.toLocaleString()}</p>
                  <p className="text-green-600 text-sm">บาท</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaMoneyBill className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium mb-1">รายจ่ายเดือนนี้</p>
                  <p className="text-3xl font-bold text-red-700">{dashboardData.monthlyExpenses.toLocaleString()}</p>
                  <p className="text-red-600 text-sm">บาท</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <FaMoneyCheckAlt className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">คิวงานรอดำเนินการ</p>
                  <p className="text-3xl font-bold text-blue-700">{dashboardData.pendingQueues}</p>
                  <p className="text-blue-600 text-sm">รายการ {dashboardData.totalPairs} คู่</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaListUl className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium mb-1">รายรับวันนี้</p>
                  <p className="text-3xl font-bold text-yellow-700">{dashboardData.dailyIncome.toLocaleString()}</p>
                  <p className="text-yellow-600 text-sm">บาท</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-white w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaClipboardList className="mr-3 text-blue-500" />
                  คิวงานที่รอดำเนินการ ({queueData.length} รายการ)
                </h2>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors">
                  + เพิ่มคิวใหม่
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานที่</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนคู่</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่รับ</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ส่งคืน</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {queueData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaMapMarkerAlt className="mr-2 text-gray-400 w-3 h-3" />
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pairs}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.received}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${item.overdue ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                          {item.delivery}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-800'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaCalendarAlt className="mr-3 text-purple-500" />
                นัดหมายที่รอดำเนินการ ({appointments.length} รายการ)
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานที่</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วัน/เวลานัดหมาย</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appt.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaPhone className="mr-2 text-gray-400 w-3 h-3" />
                          {appt.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaMapMarkerAlt className="mr-2 text-gray-400 w-3 h-3" />
                          {appt.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaClock className="mr-2 text-gray-400 w-3 h-3" />
                          {new Date(appt.date).toLocaleDateString('th-TH')} {appt.time.slice(0,5)} น.
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[appt.status] || 'bg-gray-100 text-gray-800'}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernDashboard;