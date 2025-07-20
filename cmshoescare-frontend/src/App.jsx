import React, { useState } from 'react';
import HomePage from "./components/HomePage";
import CreateAppointmentForm from "./components/CreateAppointmentForm";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="font-sans bg-white min-h-screen">
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'appointment' && <CreateAppointmentForm setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;
