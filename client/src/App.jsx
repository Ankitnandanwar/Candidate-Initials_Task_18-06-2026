import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Employees from './pages/Employees'
import Attendence from './pages/Attendence'
import Leave from './pages/Leave'
import Payslips from './pages/Payslips'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout'
import LoginForm from './components/LoginForm'

const PrivateWrapper = () => {
  const token = localStorage.getItem('token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<LoginForm role="admin" title="Admin / HR Panel" subtitle="Sign in to your admin account" />} />
        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Panel" subtitle="Sign in to your employee account" />} />

        <Route element={<PrivateWrapper />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendence />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </>
  )
}

export default App