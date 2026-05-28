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

function PrivateRoute({ children, requireAuth = false }) {
  const { user, isGuest, loading } = useAuth()
  
  if (loading) return null
  
  // If the route requires a real user and we don't have one
  if (requireAuth && !user) {
    return <Navigate to="/auth" />
  }

  // If we have a user or it's a guest
  if (user || isGuest) {
    return <Layout>{children}</Layout>
  }

  // Otherwise go to auth
  return <Navigate to="/auth" />
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
              <PrivateRoute requireAuth={true}>
                <Favorites />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute requireAuth={true}>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute requireAuth={true}>
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
