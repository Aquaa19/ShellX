import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { 
  LoginScreen,
  DashboardScreen,
  StudentsScreen,
  StudentDetailScreen,
  CurriculumScreen,
  GatewaysScreen,
  AuditsScreen
} from '../screens';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Private Routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/students" element={<StudentsScreen />} />
          <Route path="/students/:id" element={<StudentDetailScreen />} />
          <Route path="/curriculum" element={<CurriculumScreen />} />
          <Route path="/gateways" element={<GatewaysScreen />} />
          <Route path="/audits" element={<AuditsScreen />} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
