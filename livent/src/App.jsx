import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './pages/Auth'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import EventDetail from './pages/EventDetail'
import PublisherDashboard from './pages/PublisherDashboard'
import Layout from './components/Layout'

function PrivateRoute({ children, requireAuth = false }) {
  const { user, isGuest, loading } = useAuth()
  
  if (loading) return null
  
  // Si la ruta requiere un usuario real y no tenemos uno
  if (requireAuth && !user) {
    return <Navigate to="/auth" />
  }

  // Si tenemos un usuario o es un invitado
  if (user || isGuest) {
    return <Layout>{children}</Layout>
  }

  // De lo contrario, ir a autenticación
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
