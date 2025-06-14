import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Order from './Order';
import Landing from './pages/Landing';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/order" element={<Order />} />
        <Route path="/landing" element={<Landing />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
