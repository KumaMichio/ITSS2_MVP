import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import JobsPage from './pages/JobsPage'
import ProfilePage from './pages/ProfilePage'
import PlaceholderPage from './pages/PlaceholderPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useStore()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="settings" element={<ProfilePage />} />
          <Route
            path="insights"
            element={<PlaceholderPage title="Match Insights" description="Phân tích chi tiết xu hướng matching của bạn — sắp ra mắt." />}
          />
          <Route
            path="trust"
            element={<PlaceholderPage title="Trust Scores" description="Xếp hạng độ tin cậy tất cả công ty — sắp ra mắt." />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
