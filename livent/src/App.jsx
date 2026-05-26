import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './pages/Auth'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import EventDetail from './pages/EventDetail'
import PublisherDashboard from './pages/PublisherDashboard'
import Layout from './components/Layout'
import './App.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return null
  return user ? <Layout>{children}</Layout> : <Navigate to="/auth" />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <PublisherDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/event/:id" 
            element={
              <PrivateRoute>
                <EventDetail />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
