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
import RegisterOrganisation from './components/auth/RegisterOrganisation';
import AddDetails from './pages/AddDetails';
import { UserProvider } from './contexts/UserContext';

function App() {
 
  
  return (
    <UserProvider>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="add-details" element={<AddDetails />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="clustering" element={<ClusteringPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="budget-alerts" element={<BudgetAlertsPage />} />
          <Route path="savings-goals" element={<SavingsGoalsPage />} />
          <Route path="family-members" element={<FamilyMembersPage />} />
          <Route path="register-organization" element={<RegisterOrganisation />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
