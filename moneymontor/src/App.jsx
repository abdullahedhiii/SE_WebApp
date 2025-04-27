import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import ClusteringPage from './pages/ClusteringPage';
import ForecastPage from './pages/ForecastPage';
import InsightsPage from './pages/InsightsPage';
import BudgetAlertsPage from './pages/BudgetAlertsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import FamilyMembersPage from './pages/FamilyMembersPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './services/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="clustering" element={<ClusteringPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="budget-alerts" element={<BudgetAlertsPage />} />
          <Route path="savings-goals" element={<SavingsGoalsPage />} />
          <Route path="family-members" element={<FamilyMembersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
