import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import JobsPage from './pages/JobsPage'
import ProfilePage from './pages/ProfilePage'
import BookmarksPage from './pages/BookmarksPage'
import InsightsPage from './pages/InsightsPage'
import TrustPage from './pages/TrustPage'

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
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="settings" element={<ProfilePage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="trust" element={<TrustPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
