import React from 'react';
import './styles/animations.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import XrayDiagnosis from './components/XrayDiagnosis';
import HealthPlans from './components/HealthPlans';
import AppointmentScheduling from './components/AppointmentScheduling';
import MentalHealthSupport from './components/MentalHealthSupport';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicy from './components/PrivacyPolicy';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/xray-diagnosis" element={<XrayDiagnosis />} />
          <Route path="/health-plans" element={<HealthPlans />} />
          <Route path="/appointments" element={<AppointmentScheduling />} />
          <Route path="/mental-health" element={<MentalHealthSupport />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;